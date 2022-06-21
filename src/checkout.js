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
                customFields: [{
                    type: "cpf_",
                    value: "08808512363"
                }]
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
            const ON_ERROR = function(pageError, menssageAlert) {
                SELF.menssageAlert = menssageAlert
                SELF.page = pageError
                $("#modal-alert").modal("show")
            }
            inputsUser = inputsUser.filter(item => item !== "")
            if (inputsUser.length !== Object.keys(SELF.user).length) {
                // Abre o modal com o alerta
                ON_ERROR(0, "Preencha todos os campos")
                SELF.steps.cadastro = false
            } else if (SELF.user.password !== SELF.user.confirmPassword) {
                // Abre o modal com o alerta
                ON_ERROR(0, "As senhas não conferem")
                SELF.steps.cadastro = false
            } else if (!SELF.cpfValidation(SELF.user.customFields[0].value)) {
                // Abre o modal com o alerta
                ON_ERROR(0, "CPF inválido")
                SELF.steps.cadastro = false
            } else if (!SELF.emailValidation(SELF.user.email)) {
                // Valida o e-mail
                // Abre o modal com o alerta
                ON_ERROR(0, "E-mail inválido")
                SELF.steps.cadastro = false
            } else {
                // Efetua post para verificar se o nome de usuário já existe
                $.post("../PHP-REST/actions.php", {
                    user: SELF.user
                }).done(function(data) {
                    data = JSON.parse(data)
                    if (!data[0].id) {
                        switch (data[0]) {
                            case "invalid_parameter_exception":
                                if ((error = data[1].split(":"))[0] == "Username already exists") {
                                    ON_ERROR(0, `O nome de usuário ${SELF.user.username} já existe`)
                                    SELF.steps.cadastro = false
                                }
                                break;
                            case "moodle_exception": // Erro interno do moodle
                                // Convert data[2] de html em string
                                data[2] = data[2].replace(/<[^>]*>/g, '')
                                data[2] = data[2].replace(/error\//g, '')
                                ON_ERROR(0, data[2])
                                SELF.steps.cadastro = false

                        }
                    }
                    if (error.abaError !== false) SELF.page = error.abaError
                })
            }
            //  else if ($("#Field-numberInput").val().length !== 16) {
            //     // Abre o modal com o alerta
            //     SELF.menssageAlert = "Número de cartão inválido"
            //     $("#modal-alert").modal("show")
            //     error.abaError = 1
            //     SELF.steps.cadastro = false
            // } else if ($("#Field-expiryInput").val().length !== 5) {
            //     // Abre o modal com o alerta
            //     SELF.menssageAlert = "Data de expiração inválida"
            //     $("#modal-alert").modal("show")
            //     error.abaError = 1
            //     SELF.steps.cadastro = false
            // } else if ($("#Field-cvcInput").val().length < 3) {
            //     // Abre o modal com o alerta
            //     SELF.menssageAlert = "CVC inválido"
            //     $("#modal-alert").modal("show")
            //     error.abaError = 1
            //     SELF.steps.cadastro = false

            // }

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
        },

        // Envia o formulário
        submitForm: function(e) {
            SELF = this
            $.post("../PHP-REST/actions.php", {
                user: SELF.user
            }).done(function(data) {
                console.log(data)
                if (data.status == "success") {
                    SELF.menssageAlert = "Cadastro realizado com sucesso"
                    $("#modal-alert").modal("show")
                    SELF.steps.cadastro = false
                } else {
                    SELF.menssageAlert = "Erro ao realizar o cadastro"
                    $("#modal-alert").modal("show")
                }
            })
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
                SELF.submitForm();
                // $("#payment-form").submit(); // Enviar o formulário apenas se puder cadastrar usuário
            });
        }

        // Remove o load
        $("#loading").remove();
    }
}).mount('#app')