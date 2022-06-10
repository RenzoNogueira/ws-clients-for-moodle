# ws-clients-for-moodle
Web service client demo for modle version 3.11.4+<br>
Demostração de cliente de serviço web para o moddle versão 3.11.4+

This project is free. I accept contributions.<br>
Este projeto é gratuito. Aceito contribuições.

# General structure of the object to be sent
list of (  <br>
object { <br>
createpassword int  Opcional //True if password should be created and mailed to user. <br>
username string   //Username policy is defined in Moodle security config. <br>
auth string  Padrão para "manual" //Auth plugins include manual, ldap, etc <br>
password string  Opcional //Plain text password consisting of any characters <br>
firstname string   //The first name(s) of the user <br>
lastname string   //The family name of the user <br>
email string   //A valid and unique email address <br>
maildisplay int  Opcional //Email display <br>
city string  Opcional //Home city of the user <br>
country string  Opcional //Home country code of the user, such as AU or CZ <br>
timezone string  Opcional //Timezone code such as Australia/Perth, or 99 for default <br>
description string  Opcional //User profile description, no HTML <br>
firstnamephonetic string  Opcional //The first name(s) phonetically of the user <br>
lastnamephonetic string  Opcional //The family name phonetically of the user <br>
middlename string  Opcional //The middle name of the user <br>
alternatename string  Opcional //The alternate name of the user <br>
interests string  Opcional //User interests (separated by commas) <br>
idnumber string  Padrão para "" //An arbitrary ID code number perhaps from the institution <br>
institution string  Opcional //institution <br>
department string  Opcional //department <br>
phone1 string  Opcional //Phone 1 <br>
phone2 string  Opcional //Phone 2 <br>
address string  Opcional //Postal address <br>
lang string  Padrão para "pt_br" //Language code such as "en", must exist on server <br>
calendartype string  Padrão para "gregorian" //Calendar type such as "gregorian", must exist on server <br>
theme string  Opcional //Theme name such as "standard", must exist on server <br>
mailformat int  Opcional //Mail format code is 0 for plain text, 1 for HTML etc <br>
customfields  Opcional //User custom fields (also known as user profil fields) <br>
list of (  <br>
object { <br>
type string   //The name of the custom field <br>
value string   //The value of the custom field <br>
}  <br>
)preferences  Opcional //User preferences <br>
list of (  <br>
object { <br>
type string   //The name of the preference <br>
value string   //The value of the preference <br>
}  <br>
)}  <br>
) <br>