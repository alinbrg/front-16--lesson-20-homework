// // COMMENT modals, popup
function dynamicOpenModal(selector) {
	const modal = document.querySelector(selector);
	if (modal) {
		modal.classList.add("open");

		const closeBtn = modal.querySelector(".modal-close");
		closeBtn.addEventListener("click", () => {
			dynamicCloseModal(selector);
		});
	}
}

function dynamicCloseModal(selector) {
	const modal = document.querySelector(selector);
	if (modal) {
		modal.classList.remove("open");
	}
}

const openRegFormBtn = document.querySelector("#open-reg-form");
openRegFormBtn.addEventListener("click", () => {
	dynamicOpenModal("#reg-modal");
});

//NOTE Requests and Responses

const regModal = "#reg-modal";

const createUserUrl = "http://borjomi.loremipsum.ge/api/register", //method POST
	getAllUsersUrl = "http://borjomi.loremipsum.ge/api/all-users", //method GET
	getSingleUserUrl = "http://borjomi.loremipsum.ge/api/get-user/1 ", //id method  GET
	updateUserUrl = "http://borjomi.loremipsum.ge/api/update-user/1 ", //id method PUT
	deleteUserUrl = "http://borjomi.loremipsum.ge/api/delete-user/1"; //id method DELETE

const regForm = document.querySelector("#reg"),
	user_Name = document.querySelector("#user_name"),
	userSurname = document.querySelector("#user_surname"),
	userEmail = document.querySelector("#user_email"),
	userPhone = document.querySelector("#user_phone"),
	userPersonalID = document.querySelector("#user_personal-id"),
	userZip = document.querySelector("#user_zip-code"),
	userGender = document.querySelector("#user_gender"),
	// user id ფორმში, რომელიც გვჭირდება დაედითებისთვის
	user_id = document.querySelector("#user_id"),
	userTableBody = document.querySelector("#user-rows");

// TODO: დაასრულეთ შემდეგი ფუნქციები
function renderUsers(usersArray) {
	// TODO: usersArray არის სერვერიდან დაბრუნებული ობიექტების მასივი
	// TODO: ამ მონაცმების მიხედვით html ში ჩასვით ცხრილი როგორც "ცხრილი.png" შია
	//

	// თითოეული იუზერისთვის ვქმნით tr-ს html-ში
	const userRows = usersArray.map((user) => {
		return `
					<tr>
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
						<td>${user.email}</td>
						<td>${user.id_number}</td>
						<td>${user.phone}</td>
            <td>${user.zip_code}</td>
            <td>${user.gender}</td>
            <td>
                <button class="edit btn" type="button" data-user-id="${user.id}">Edit</button>
                <button class="dlt btn" type="button" data-user-id="${user.id}">Delete</button>
            </td>
          </tr>`;
	});
	userTableBody.innerHTML = userRows.join("");
	console.log(usersArray);
	userActions(); // ყოველ რენდერზე ახლიდან უნდა მივაბათ ივენთ ლისნერები
}

// TODO: დაასრულე
function userActions() {
	// 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
	// 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
	// 3. id შეინახეთ data-user-id ატრიბუტად ღილაკებზე, data ატრიბუტებზე წვდომა შეგიძლიათ dataset-ის გამოყენებით
	//  selectedElement.dataset
	// 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id
	// 5. ედიტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი
	// ედიტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს
	// და არა მასივს)
	// ეს დატა უნდა შეივსოს ფორმში
	// და ამის შემდეგ შეგიძლიათ დააედიტოთ ეს ინფორმაცია და ფორმის დასაბმითებისას უნდა მოხდეს updateUser()
	// ფუნქციის გამოძახება, სადაც გადასცემთ განახლებულ იუზერის ობიექტს, გვჭირდება იუზერის აიდიც, რომელიც
	// მოდალის გახსნისას user_id-ის (hidden input არის და ვიზუალურად არ ჩანს) value-ში შეგიძლია შეინახოთ

	// ამ ფუნქციის გამოძახებისას ეს ღილაკები უკვე გვაქვს html-ში და შეგვიძლია მათი დასელექთება
	const userEditButtons = document.querySelectorAll(".edit");
	const userDeleteButtons = document.querySelectorAll(".dlt");
	userEditButtons.forEach((btn) => {
		// ედითზე ვიღებთ id-ს და ვიძახებთ getUser ფუნქციას
		btn.addEventListener("click", async () => {
			const userId = btn.dataset.userId;
			const userData = await getUser(userId);
			// getUser მთლიან ინფორმაციას გვიბრუნებს, ჩვენ მხოლოდ იუზერის ობიექტი გვჭირდება
			const user = userData.users;
			// console.log(user);

			// ფუნქციიდან დაბრუნებული მონაცემებით ვავსებთ ფორმას და მოდალს ვხსნით
			fillForm(user);
			dynamicOpenModal(regModal);
		});
	});

	userDeleteButtons.forEach((btn) => {
		// წაშლაზე შესაბამის ფუნქციას ვიძახებთ
		btn.addEventListener("click", () => {
			const userId = btn.dataset.userId;
			deleteUser(userId);
		});
	});
}

async function getUser(id) {
	try {
		const response = await fetch(
			`http://borjomi.loremipsum.ge/api/get-user/${id}`
		);
		const data = await response.json();
		// console.log(data);
		// ვაბრუნებთ მთლიან ინფორმაციას
		return data;
	} catch (e) {
		console.log("Error - ", e);
	}
}

function getUsers() {
	fetch("http://borjomi.loremipsum.ge/api/all-users")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			let users = data.users;
			// console.log(users);

			// html-ში გამოტანა მონაცემების
			renderUsers(users);
		})
		.catch((error) => {
			console.log(error);
		});
}

function deleteUser(id) {
	fetch(`http://borjomi.loremipsum.ge/api/delete-user/${id}`, {
		method: "delete",
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			// გვიბრუნებს სტატუსს
			getUsers();
		})
		.catch((error) => {
			console.log(error);
		});
}

// ამ ფუნქციას ფორმის დასაბმითებისას ვიძახებთ, თუ ეს ფორმი დაედითების ღილაკზე კლიკის შემდეგ გაიხსნა
function updateUser(userObj) {
	// მიიღებს დაედითებულ ინფორმაციას და გააგზავნით სერვერზე
	// TODO დაასრულეთ ფუნქცია
	//  method: "put",  http://borjomi.loremipsum.ge/api/update-user/${userObj.id}
	// TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა

	fetch(`http://borjomi.loremipsum.ge/api/update-user/${userObj.id}`, {
		method: "put",
		body: JSON.stringify(userObj),
		headers: { "Content-Type": "application/json" },
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);

			// ხელახლა ვაკეთებთ იუზერების რენდერს
			getUsers();
			// ვასუფთავებთ ფორმას, ვხურავთ და html-ში დამატებულ hidden inout-ის id-ს ''-ს ვუტოლებთ
			regForm.reset();
			dynamicCloseModal(regModal);
			user_id.value = "";
		});
}

function createUser(userData) {
	fetch("http://borjomi.loremipsum.ge/api/register", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// გვიბრუნებს სტატსუსს (წარმატებით გაიგზავნა თუ არა) და დამატებული იუზერის ობიექტს
			// დატის მიღების შემდეგ ვწერთ ჩვენს კოდს
			console.log(data);
			// ხელახლა გამოგვაქვს ყველა იუზერი
			// TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა

			getUsers();
			// იუზერის დამატების შემდეგ ხელახლა ვარენდერებთ ცხრილს და ფორმას ვასუფთავებთ
			regForm.reset();
			dynamicCloseModal(regModal);
			user_id.value = "";
		})
		.catch((error) => {
			console.log(error);
		});
}

// ამ ფუნქციას ვიყენებთ ედითის ღილაკზე დაჭერისას ფორმის შევსებისთვის
function fillForm(userData) {
	userEmail.value = userData.email;
	userPersonalID.value = userData.id_number;
	userPhone.value = userData.phone;
	user_Name.value = userData.first_name;
	userSurname.value = userData.last_name;
	userZip.value = userData.zip_code;
	userGender.value = userData.gender;
	user_id.value = userData.id;
}

// თავდაპირველად რომ ჩაირვირთოს იუზერების ცხრილი

getUsers();

regForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const userInfo = {
		id: user_id.value,
		first_name: user_Name.value,
		last_name: userSurname.value,
		phone: userPhone.value,
		id_number: userPersonalID.value,
		email: userEmail.value,
		gender: userGender.value,
		zip_code: userZip.value,
	};

	//  TODO: თუ user_id.value არის ცარიელი მაშინ უნდა შევქმნათ  -->  createUser(userData);
	// TODO: თუ user_id.value არის მაშინ უნდა დავაედიტოთ, (როცა ფორმს ედითის ღილაკის შემდეგ იუზერის ინფოთი
	// ვავსებთ, ვაედითებთ და ვასაბმითებს) -->  updateUser(userData);
	if (userInfo.id) {
		updateUser(userInfo);
	} else {
		createUser(userInfo);
	}
});
