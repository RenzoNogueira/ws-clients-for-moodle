/*
 * @author: Lux Andrew
 * @date 2022
 * @description: Cadastra usuário e realiza o pagamento na plaftforma Moodle
 * @version: 1.0
 */

const { createApp } = Vue
createApp({
    data() {
        return {
            stripe: Stripe("pk_test_51Kufx5I4YwwPzrij5CM4NaKXv5z5iNmWAfBfv95eJpCFCqkYaIvianZkwTdYq3tkCEvz6YcqiR2RX9Fk4PqAYWIb00pMIhFU1C"), // Stripe key
            items: [{ id: "price_1Kv3ZkI4YwwPzrijvkvk9fc0" }], // String com o id do produto
            elements: null, // Stripe elements
            paymentSucceeded: false, // Flag para indicar se o pagamento foi realizado com sucesso
            menssageAlert: "",
            page: 0,
            user: { // Dados do formulário de cadastro
                username: "renzo",
                email: "teste@mail.com",
                password: "senha123",
                confirmPassword: "senha123",
                firstName: "PrimeiroNome",
                lastName: "SegundoNome",
                cpf: "08808512363",
            },
            course: {
                id: "1",
                name: "Curso de Teste",
                description: "Curso de Teste",
                price: "100",
                image: "https://picsum.photos/200/300",
            },
            steps: { // Abas finalizadas
                cadastro: false,
                payment: false,
            },
        }
    },
    watch: {
        page: function(currentPage) {
            SELF = this
            if (currentPage !== 0) {
                // Verifica se todos os atributos do objeto user estão preenchidos
                inputsUser = Object.values(SELF.user)
                inputsUser = inputsUser.filter(item => item !== "")
                if (inputsUser.length === Object.keys(SELF.user).length) {
                    SELF.steps.cadastro = true
                } else {
                    SELF.steps.cadastro = false
                }
            } else if (currentPage === 0) {
                // SELF.steps.cadastro = false
                // SELF.steps.payment = true
            }
            SELF.verifyFormSignUp()
        }
    },
    methods: {

        // Veridica os formulários
        verifyFormSignUp: function() {
            SELF = this
                // Verifica se todos os atributos do objeto user estão preenchidos
            inputsUser = Object.values(SELF.user)
            error = {
                abaError: false,
            }
            inputsUser = inputsUser.filter(item => item !== "")
            if (inputsUser.length !== Object.keys(SELF.user).length) {
                // Abre o modal com o alerta
                SELF.menssageAlert = "Preencha todos os campos"
                $("#modal-alert").modal("show")
                error.abaError = 0
                SELF.steps.cadastro = false
            } else if (SELF.user.password !== SELF.user.confirmPassword) {
                // Abre o modal com o alerta
                console.log([SELF.user.password, SELF.user.confirmPassword])
                SELF.menssageAlert = "As senhas não conferem"
                $("#modal-alert").modal("show")
                error.abaError = 0
                SELF.steps.cadastro = false
            } else if (!SELF.cpfValidation(SELF.user.cpf)) {
                // Abre o modal com o alerta
                SELF.menssageAlert = "CPF inválido"
                $("#modal-alert").modal("show")
                error.abaError = 0
                SELF.steps.cadastro = false
            } else {
                // Valida o e-mail
                if (!SELF.emailValidation(SELF.user.email)) {
                    // Abre o modal com o alerta
                    SELF.menssageAlert = "E-mail inválido"
                    $("#modal-alert").modal("show")
                    error.abaError = 0
                    SELF.steps.cadastro = false
                }

            }

            if (error.abaError !== false) SELF.page = error.abaError
        },

        initialize: async function() { // Stripe
            const SELF = this
            items = SELF.items
            const { clientSecret } = await fetch("../STRIPE/create.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            }).then((r) => r.json());

            elements = SELF.stripe.elements({ clientSecret });

            const paymentElement = elements.create("payment");
            paymentElement.mount("#payment-element");
        },

        handleSubmit: async function(e) { // Stripe
            SELF = this
            e.preventDefault();
            SELF.setLoading(true);
            const { error } = await SELF.stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "http://localhost/ws-clients-for-moodle/src/checkout.html",
                    receipt_email: SELF.user.email,
                },
            });

            if (error.type === "card_error" || error.type === "validation_error") {
                SELF.showMessage(error.message);
            } else {
                SELF.showMessage("An unexpected error occurred.");
            }

            SELF.setLoading(false);
        },

        checkStatus: async function() { // Stripe
            SELF = this
            const clientSecret = new URLSearchParams(window.location.search).get(
                "payment_intent_client_secret"
            );

            if (!clientSecret) {
                return;
            }

            const { paymentIntent } = await SELF.stripe.retrievePaymentIntent(clientSecret);

            switch (paymentIntent.status) {
                case "succeeded":
                    SELF.showMessage("Payment succeeded!");
                    break;
                case "processing":
                    SELF.showMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    SELF.showMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    SELF.showMessage("Something went wrong.");
                    break;
            }
        },

        showMessage: function(messageText) { // Stripe
            const messageContainer = document.querySelector("#payment-message");

            messageContainer.classList.remove("hidden");
            messageContainer.textContent = messageText;

            setTimeout(function() {
                messageContainer.classList.add("hidden");
                messageText.textContent = "";
            }, 4000);
        },

        setLoading: function(isLoading) { // Stripe
            if (isLoading) {
                // Disable the button and show a spinner
                document.querySelector("#submit").disabled = true;
                document.querySelector("#spinner").classList.remove("hidden");
                document.querySelector("#button-text").classList.add("hidden");
            } else {
                document.querySelector("#submit").disabled = false;
                document.querySelector("#spinner").classList.add("hidden");
                document.querySelector("#button-text").classList.remove("hidden");
            }
        },

        // Verifica a autenticidade do CPF
        cpfValidation: function(cpf) {
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf == '') return false;
            // Elimina CPFs invalidos conhecidos
            if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
                return false;
            // Valida 1o digito
            add = 0;
            for (i = 0; i < 9; i++)
                add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(9)))
                return false;
            // Valida 2o digito
            add = 0;
            for (i = 0; i < 10; i++)
                add += parseInt(cpf.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(10)))
                return false;
            return true;
        },

        // Verifica a autenticidade do E-mail
        emailValidation: function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
            return re.test(String(email).toLowerCase());
        }

    },

    mounted: function() {
        SELF = this
            // Se não existir parâmetro redirect_status na URL
        var url = new URL(window.location.href);
        var redirect_status = url.searchParams.get("redirect_status");
        if (redirect_status != "succeeded") {
            // Inicialização do Stripe
            SELF.initialize();
            SELF.checkStatus();
            $("#payment-form").submit(SELF.handleSubmit);

            // Mask CPF
            $('#cpf').mask('000.000.000-00', { reverse: true });
            $("#submit").click(function() {
                console.log("clicked");
                $("#payment-form").submit();
            });
        }

        // Remove o load
        $("#loading").remove();
    }
}).mount('#app')