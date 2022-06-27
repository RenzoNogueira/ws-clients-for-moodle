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
            // Caso o usuário já tenha conta
            isLogged: false,
            passwordDefault: "EVOLUE123",
            page: 0,
            user: { // Dados do formulário de cadastro
                email: "",
                password: "EVOLUE123",
                firstname: "",
                lastname: "",
                customfields: [{
                    type: "cpf_",
                    value: "088.085.123-63"
                }]
            },
            course: {
                id: 264,
                priceId: [{ id: "price_1Kv3ZkI4YwwPzrijvkvk9fc0" }], // Id do produto
                name: "",
                price: "100",
                description: "Descrição do curso",
                image: "",
                imageDefault: "https://ead.grupoevolue.com.br/assets/img/logo/custom-logo.png",
            }
        }
    },
    watch: {
        page: function(currentPage) {
            SELF = this
            SELF.verifyFormSignUp()
        },
        isLogged: function(isLogged) {
            SELF = this
            if (isLogged) {
                SELF.user.password = SELF.user.firstname = SELF.user.lastname = SELF.user.email = ""

            } else SELF.user.password = SELF.passwordDefault
        }
    },
    methods: {
        // Verifica os formulários
        verifyFormSignUp: function() { // Verifica se todos os atributos do objeto user estão preenchidos
            SELF = this
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
            if (inputsUser.length !== Object.keys(SELF.user).length && !SELF.isLogged ||
                SELF.isLogged && (SELF.user.password.length === 0 || SELF.user.customfields[0].value.length === 0)) {
                // Abre o modal com o alerta
                ON_ERROR(0, "Preencha todos os campos")
            } else if (!SELF.cpfValidation(SELF.user.customfields[0].value)) {
                // Abre o modal com o alerta
                ON_ERROR(0, "CPF inválido")
            } else if (!SELF.emailValidation(SELF.user.email) && !SELF.isLogged) {
                // Valida o e-mail
                ON_ERROR(0, "E-mail inválido")
            } else {
                // Efetua post para verificar se o nome de usuário já existe
                if (SELF.isLogged) SELF.verifyUserLogin()
                else SELF.verifyUsername()

            }
            if (error.abaError !== false) SELF.page = error.abaError
        },

        // Verifica se o nome de usuário já existe
        verifyUsername: async function(getUser = false) {
            SELF = this
            const USERNAME = SELF.user.customfields[0].value
            const dataReturn = await $.get("../core_user_get_users_by_field.php", {
                user: {
                    field: 'username',
                    values: [USERNAME]
                }
            }).done(function(data) {
                if ((Object.keys.length > 0) > 0) {
                    // data = JSON.parse(data)
                    if (data[0] !== undefined && data[0].username === USERNAME) {
                        if (!getUser) {
                            SELF.menssageAlert = `O CPF ${USERNAME} já está cadastrado.`
                            SELF.page = 0
                            $("#modal-alert").modal("show")
                        } else {
                            return data
                        }
                    }
                }
            })
            return dataReturn
        },

        // Verifica se o usuário confere com oos dados de login do Moodle
        verifyUserLogin: function() {
            SELF = this
            const USERNAME = SELF.user.customfields[0].value
            const PASSWORD = SELF.user.password
            $.get("../confirm_login_account_user.php", {
                user: {
                    username: USERNAME,
                    password: PASSWORD
                }
            }).done(function(data) {
                data = JSON.parse(data)
                if (data.token == undefined) {
                    SELF.menssageAlert = "Usuário e senha não conferem"
                    SELF.page = 0
                    $("#modal-alert").modal("show")
                } else {
                    SELF.verifyUsername(true).then(function(data) {
                        if ((Object.keys.length > 0) > 0) {
                            if (data[0] !== undefined) {
                                SELF.user.id = data[0].id
                                SELF.user.email = data[0].email
                                SELF.user.firstname = data[0].firstname
                                SELF.user.lastname = data[0].lastname
                                SELF.user.customfields = data[0].customfields
                                SELF.isLogged = true
                            }
                        }
                    })
                }
            })
        },

        // Verifica se o usuário já é inscrito no curso
        verifyUserCourse: function() {
            SELF = this
            $.get("../core_enrol_get_enrolled_users.php", {
                course: {
                    id: SELF.course.id,
                    userid: SELF.user.id
                }
            }).done(function(data) {
                data = JSON.parse(data)
                if (data[0] !== undefined && data[0].username === SELF.user.username) {
                    // Abre o modal com o alerta
                    SELF.menssageAlert = `O usuário ${SELF.user.username} já está inscrito no curso`
                    SELF.page = 0
                    $("#modal-alert").modal("show")
                }
            })
        },

        // Envia o formulário
        submitForm: function(e) {
            SELF = this
                // Salva o cpf como usuário
            SELF.user.username = SELF.user.customfields[0].value
            $.post("../core_user_create_users.php", {
                user: SELF.user
            }).done(function(data) {
                if (Object.keys.length > 0) {
                    if (data.status == "success") { // Se o cadastro foi realizado com sucesso
                        SELF.paymentSucceeded = true
                    } else {
                        SELF.menssageAlert = "Erro ao realizar o cadastro"
                        $("#modal-alert").modal("show")
                    }
                }
            })
        },

        // Realiza a inscrição no curso
        submitCourse: function(e) {
            SELF = this
            const USERNAME = SELF.user.customfields[0].value
            $.get("../core_user_get_users_by_field.php", { // Pega o id do usuário
                user: {
                    field: 'username',
                    values: [USERNAME]
                }
            }).done(function(data) {
                if (Object.keys.length > 0) {
                    if (data = data[0]) {
                        SELF.user.id = data.id
                        $.post("../enrol_manual_enrol_users.php", { // Inscreve o usuário no curso
                            data: {
                                courseid: SELF.course.id,
                                userid: SELF.user.id
                            }
                        }).done(function(data) {
                            if (Object.keys.length > 0) {
                                if (data == null) { // Se a inscrição foi realizada com sucesso
                                    SELF.paymentSucceeded = true
                                } else {
                                    SELF.menssageAlert = "Erro ao realizar a inscrição"
                                    $("#modal-alert").modal("show")
                                }
                            }
                        })
                    }
                }
            })
        },

        // Pega os dados do curso
        getCourse: function(e) {
            SELF = this
            $.get("../core_course_get_courses_by_field.php", {
                course: {
                    field: 'id',
                    value: SELF.course.id
                }
            }).done(function(data) {
                if ((Object.keys.length > 0) > 0) {
                    const COURSE = data.courses[0]
                    SELF.course.image = `../image_course.php?url=${COURSE.overviewfiles[0].fileurl}&urlDefault=${SELF.course.imageDefault}` // Executa a requisição para pegar a imagem do curso
                    SELF.course.name = COURSE.displayname
                    SELF.course.description = COURSE.summary
                }
            })
        },

        saveUserToSession: function() {
            SELF = this
            sessionStorage.setItem("user", JSON.stringify(SELF.user))
            sessionStorage.setItem("isLogged", SELF.isLogged)
        },

        initialize: async function() { // Stripe
            const SELF = this
            items = SELF.course.priceId
            const { clientSecret } = await fetch("../../STRIPE/create.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            }).then((r) => r.json());

            elements = SELF.stripe.elements({ clientSecret });

            const paymentElement = elements.create("payment");
            if ($("#payment-element").length > 0) paymentElement.mount("#payment-element");
        },

        handleSubmit: async function(e) { // Stripe
            SELF = this
            e.preventDefault();
            SELF.setLoading(true);
            const { error } = await SELF.stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "http://localhost/ws-clients-for-moodle/src/html/checkout.html",
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
                    SELF.submitCourse()
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
            // Se existe o elemento, então exibe o texto
            try {
                messageContainer.classList.remove("hidden");
                messageContainer.textContent = messageText;

                setTimeout(function() {
                    messageContainer.classList.add("hidden");
                    messageText.textContent = "";
                }, 4000);
            } catch (error) {}
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
        var url = new URL(window.location.href)
        SELF.user.password = SELF.passwordDefault // Define a senha padrão
        SELF.initialize() // Inicialização do Stripe
        SELF.checkStatus()
        $("#payment-form").submit(SELF.handleSubmit)
        $("#submit").click(function() {
            SELF.saveUserToSession()
            $("#payment-form").submit() // Enviar o formulário apenas se puder cadastrar usuário
        })
        $("#loading").remove() // Remove o load
        $('#cpf').mask('000.000.000-00') // Mask CPF
        const statusPayment = new URLSearchParams(window.location.search).get('redirect_status') === 'succeeded'
        userSesseion = sessionStorage.getItem('user')
        SELF.isLogged = sessionStorage.getItem("isLogged") === "true"
        if (statusPayment && userSesseion) { // Verifica se o usuário já está salvo e se o pagamento foi realizado com sucesso
            SELF.user = JSON.parse(userSesseion)
            if (!SELF.isLogged) {
                SELF.submitForm()
            }

        }
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('isLogged')
        if (course = url.searchParams.get("c")) { // Pega o código do item pelo parâmetro da url
            SELF.course = JSON.parse(atob(course)) // OBS: O código do item é baseado em base64, pois o código do item é um JSON em base64
        }
        SELF.getCourse() // Pega os dados do curso
    }
}).mount('#app')