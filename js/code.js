const urlBase = 'http://cop4331-2024-group19.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contacts = [];
let pageNumber = 1;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				initializeContacts();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//clear the error messages in the case that the user fixes their error 

function doRegister()
{
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;

	let username = document.getElementById("registerUser").value;
	let password = document.getElementById("registerPassword").value;

	if(firstName == "" | lastName == "" | username == "" | password == "")
	{
		if(firstName == "")
		{
			document.getElementById("registerFirstNameResult").innerHTML = "Please enter a first name";
		}
		if(lastName == "")
		{
			document.getElementById("registerLastNameResult").innerHTML = "Please enter a last name";
		}
		if(username == "")
		{
			document.getElementById("registerUsernameResult").innerHTML = "Please enter a username";
		}
		if(password == "")
		{
			document.getElementById("registerPasswordResult").innerHTML = "Please enter a password";
		}
		
	}
	else
	{
		document.getElementById("registerFirstNameResult").innerHTML = "";
		document.getElementById("registerLastNameResult").innerHTML = "";
		document.getElementById("registerUsernameResult").innerHTML="";
		document.getElementById("registerPasswordResult").innerHTML="";
		document.getElementById("registerResult").innerHTML = "";

		let temp = {firstName: firstName, lastName : lastName, login: username, password : password};

		let jsonPayload = JSON.stringify(temp);

		let url = urlBase + '/Register.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		
		try {
			xhr.onreadystatechange = function () {

				if (this.readyState != 4) {
					return;
				}

				if (this.status == 409) {
					document.getElementById("registerResult").innerHTML = "User already exists";
					return;
				}

				if (this.status == 200) {

					let jsonObject = JSON.parse(xhr.responseText);
					userId = jsonObject.id;
					document.getElementById("registerResult").innerHTML = "User added";
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					saveCookie();

					//window.location.href = "contacts.html"; // commented out to test register functionality
				}
			};

			xhr.send(jsonPayload);
		} catch (err) {
			document.getElementById("registerResult").innerHTML = err.message;
		}
	}
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function addContact()
{
	let firstname = document.getElementById("contactFirstName").value;
	let lastname = document.getElementById("contactLastName").value;
	let phonenum = document.getElementById("contactPhone").value;
	let emailaddress = document.getElementById("contactEmail").value;

	if(firstname == "" | lastname == "" | phonenum == "" | emailaddress == "")
	{
		if(firstname == "")
		{
			document.getElementById("addFirstNameResult").innerHTML = "Please enter a first name";
		}
		if(lastname == "")
		{
			document.getElementById("addLastNameResult").innerHTML = "Please enter a last name";
		}
		if(phonenum == "")
		{
			document.getElementById("addPhoneResult").innerHTML = "Please enter a phone number";
		}
		if(emailaddress == "")
		{
			document.getElementById("addEmailResult").innerHTML = "Please enter an email";
		}
	}
	else {
		document.getElementById("addFirstNameResult").innerHTML ="";
		document.getElementById("addLastNameResult").innerHTML ="";
		document.getElementById("addPhoneResult").innerHTML ="";
		document.getElementById("addEmailResult").innerHTML="";
		document.getElementById("contactAddResult").innerHTML = "";

		let temp = {firstName : firstname, lastName : lastname, phone : phonenum, email : emailaddress, userId : userId};

		let jsonPayload = JSON.stringify(temp);

		let url = urlBase + '/AddContacts.' + extension;
	
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{

				if (this.readyState == 4 && this.status == 200) 
				{

					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
					searchContact();
					createContactBoxes();
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}	
}

function deleteContact(firstName, lastName)
{
	//confirm deletion first
	let contact = confirm('Confirm the deletion of contact: ' + firstName + ' ' + lastName);

	if(contact == true){

		let temp = {firstName : firstName, lastName: lastName, userId: userId};

		let jsonPayload = JSON.stringify(temp);

		let url = urlBase + '/DeleteContacts.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function (){
				if(this.readyState == 4 & this.status == 200){
					console.log(firstName + ' ' + lastName + ' has been deleted from Contacts');

					searchContact();
					createContactBoxes();
					createPageNumbers();
				}


			}
			xhr.send(jsonPayload);
		} catch (err){
			console.log(err.message);
		}

	}
}

function editContact(firstname, lastname, email, phone, id)
{
	var namef_val = document.getElementById("namef_text").value;
    var namel_val = document.getElementById("namel_text").value;
    var email_val = document.getElementById("email_text").value;
    var phone_val = document.getElementById("phone_text").value;

	let tmp = { firstName: namef_val, lastName: namel_val, phone: phone_val, email: email_val,  id: id};

	let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                console.log("Contact has been updated");

				//update the fields
				document.getElementById("namef_text").value = firstname;
                document.getElementById("namel_text").value = lastname;
                document.getElementById("email_text").value = email;
                document.getElementById("phone_text").value = phone;

				//hiding the edit fields once the contact has been udated
				document.getElementById("namef_text").style.display = "none";
                document.getElementById("namel_text").style.display = "none";
                document.getElementById("email_text").style.display = "none";
                document.getElementById("phone_text").style.display = "none";

				searchContact();
				createContactBoxes();

				//button keep up
				document.getElementById("saveButton").style.display = "none";
				document.getElementById("editButton").style.display = "block";

            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = ""
	let tmp = {search:srch, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				contacts = jsonObject.results;
				//document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				createContactBoxes();
				createPageNumbers();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

// this function is only to allow get contacts to run synchronized with createContactBoxes
function initializeContacts()
{
	getContacts(function(data) { createContactBoxes()});
}

function getContacts(callback)
{
	let tmp = {userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function () 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				contacts = jsonObject.results;
				callback(contacts);
			}
		};
		

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.error("Error during getAllUserData. HTTP status:", this.status);
	}
}

function createContactBoxes()
{
	const contactContainer = document.getElementById("contactContainer");
	while(contactContainer.firstChild)
		contactContainer.removeChild(contactContainer.firstChild);
	for (let index = (pageNumber - 1) * 10; index < pageNumber * 10; index++)
	{
		const contactContainer = document.getElementById("contactContainer");
		const contact = contacts[index];
		const contactDiv = document.createElement("div");
		contactDiv.className = "contact";

		const contactInfoDiv = document.createElement("div");
		contactInfoDiv.innerHTML = `<strong>${contact.FirstName} ${contact.LastName}</strong><br>Phone: ${contact.Phone}<br>Email: ${contact.Email}`;

		const deleteButton = document.createElement("button");
		deleteButton.innerHTML = "Delete";
		deleteButton.className = "delete-button";
		deleteButton.onclick = function()
		{
			const fname = contact.FirstName;
			const lname = contact.LastName;
			deleteContact(fname, lname);
		};
		contactDiv.appendChild(contactInfoDiv);
		contactDiv.appendChild(deleteButton);
		contactContainer.appendChild(contactDiv);

		const editButton = document.createElement("button");
		editButton.innerHTML = "Edit";
		editButton.className = "edit-button";
		editButton.onclick = function()
		{
			editButton.classList.toggle('hidden');
			var namef_data = contact.FirstName;
			var namel_data = contact.LastName;
			var email_data = contact.Email;
			var phone_data = contact.Phone;
			var id = contact.ID;

			contactInfoDiv.innerHTML = `
           	 First Name: <input type='text' id='namef_text' class='editInput' value='${namef_data}'><br>
           	 Last Name: <input type='text' id='namel_text' class='editInput' value='${namel_data}'><br>
           	 Phone: <input type='text' id='phone_text' class='editInput' value='${phone_data}'><br>
           	 Email: <input type='text' id='email_text' class='editInput' value='${email_data}'>
        	 `;

		 	const saveButton = document.createElement("button");
            saveButton.innerHTML = "Save";
			saveButton.className ="save-button";

            saveButton.onclick = function () {
				console.log("Save button clicked");
                editContact(namef_data, namel_data, email_data, phone_data, id);
            }

			const cancelButton = document.createElement("button");
			cancelButton.innerHTML = "Cancel";
			cancelButton.className ="cancel-button";

			cancelButton.onclick = function () {
				contactDiv.removeChild(cancelButton);
				contactDiv.removeChild(saveButton);
				editButton.classList.toggle('hidden');
				createContactBoxes();
				//editContact(contact.FirstName, contact.LastName, contact.Email, contact.Phone, id);
            }

			contactDiv.appendChild(cancelButton);
            contactDiv.appendChild(saveButton);
		}
		contactDiv.appendChild(contactInfoDiv);
		contactDiv.appendChild(editButton);
		contactContainer.appendChild(contactDiv);
		createPageNumbers();
	}
	
}

function createPageNumbers()
{
	const maxPageNumber = Math.floor(contacts.length / 10) + 1;
	const pageNumberContainer = document.getElementById("pageButtons");
	while(pageNumberContainer.firstChild)
		pageNumberContainer.removeChild(pageNumberContainer.firstChild);
	for(let i = 0; i < maxPageNumber; i++)
	{
		const pageButton = document.createElement("button");
		pageButton.className = "pageButton";
		pageButton.innerHTML = i + 1;
		pageButton.addEventListener("click", function() {
			pageNumber = i + 1;
			initializeContacts();
		});
		pageNumberContainer.appendChild(pageButton);
	}
}