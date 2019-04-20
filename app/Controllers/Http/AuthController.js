'use strict'

const User = use('App/Models/User');

class AuthController {

	async register({ auth, request, response }) {
		const { username, email, password } = request.post();

		let user = new User();
		user.username = username;
		user.email = email;
		user.password = password;
		await user.save();

		let accessToken = await auth.generate(user);

		return response.json({
			user,
			access_token: accessToken
		});
	}
	
	async login({ auth, request, response}) {
		try {
			const { email, password } = request.post();

			if(await auth.attempt(email, password)) {
				let user = await User.findBy('email', email);
				let accessToken = await auth.withRefreshToken().generate(user);

				return response.json({
					user,
					access_token: accessToken
				});
			}
		} catch(err) {
			console.log(err);
		}
	}

	async test({ auth, request, response }) {
		try{
			return 'berhasil, token valid.';
		} catch(err) {
			return 'token tidak valid.';
		}
	}
}

module.exports = AuthController
