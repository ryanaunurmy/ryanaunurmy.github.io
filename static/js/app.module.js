/* NyanHash AngularJS
 * @version 1.0.1
 */
var baseUrl = "https://script.google.com/macros/s/AKfycby12TYKJCKZycHNnzIfH-yodZqvJ-xX5kFajYcaMiM/dev?";

var errorCallback = function(data) {
	toastr["info"]("Session habis, Harap login kembali", "Informasi");

	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

	setTimeout(function() {
		jump('/login.html');
	}, 1000);
}

var navigationCtrl = ['$scope', 'ajaxService', function($scope, ajaxService) {
	$scope.memberJoin = 26;
}];
var homeCtrl = ['$scope', 'ajaxService', 'userService', function($scope, ajaxService, userService) {
	$scope.dashboard = {
		profit: {
			today: {
				eth: "0",
				ltc: "0",
				dsh: "0"
			},
			total: {
				eth: "0",
				ltc: "0",
				dsh: "0"
			},
		},
		contract: [
			{
				coin: 'Ethereum',
				initial: 'eth',
				hashrate: 0
			}
		],
		lastPrice: {
			eth: "N/A",
			ltc: "N/A",
			dsh: "N/A"
		},
		func: {
			predic: function(date, pack) {
				switch(date) {
					case 'd': 
						return ($scope.dashboard.profit.today[pack] * 1).toFixed(8);
						break;
					case 'w':
						return ($scope.dashboard.profit.today[pack] * 7).toFixed(8);
						break;
					case 'm':
						return ($scope.dashboard.profit.today[pack] * 30).toFixed(8);
						break;
					case 'y':
						return ($scope.dashboard.profit.today[pack] * 356).toFixed(8);
						break;
					default:
						return 0;
				}
			},
			isAlertAvailable: false
		}
	}

	var user = new userService();
	var ajax = new ajaxService(user);
	ajax.getLastPrice(function(res) {
		$scope.dashboard.lastPrice = res.data;
	});
	ajax.getDashboard(function(res) {
		if (res.data.status) {
			$scope.dashboard.profit = res.data.results.profit;
			$scope.dashboard.contract = res.data.results.contract;
		}
	});
}];
var historyCtrl = ['$scope', 'ajaxService', 'userService', function($scope, ajaxService, userService) {
	var user = new userService;
	var ajax = new ajaxService(user);

	var username = user.username;
	var token = user.token;

	$scope.$on('$viewContentLoaded', function(){
		var pembelian = $('#history-pembelian-table').DataTable({
			"ordering": false,
	        "columns": [
	            { "data": "id",
	            	render: function(data, type, row) {
	            		return "<a class='text-blue' href='#/invoice/" + data + "'>" + data + "</a>";
	            	}
	            },
	            { "data": "date" },
	            { "data": "server" },
	            { "data": "hashrate" },
	            { "data": "price",
	            	render: function(data, type, row) {
	            		return (data * 1).toFixed(8)
	            	}
	             },
	            { 
	            	"data": "status",
	            	render : function(data, type, row) {
	            		return data;
					} 
	            }
	        ]
		});
		var penarikan = $('#history-penarikan-table').DataTable({
	        "columns": [
	            { "data": "id",
	            	render: function(data, type, row) {
	            		return "<span class='text-blue'>" + data + "</span>";
	            	}
	        	},
	            { "data": "date" },
	            { "data": "jumlah",
	            	render: function(data, type, row) {
	            		return "<i class='fa fa-btc'></i> " + data;
	            	}
	            },
	            { 
	            	"data": "status",
	            	render : function(data, type, row) {
	            		return data;
					} 
	            }
	        ]
		});
		var penghasilan = $('#profitsTable').DataTable({
			"ordering": false,
	        "columns": [
	            { 
	            	data: "id",
	            	render: function(data, type, row) {
	            		return "<span class='text-blue'>" + data + "</span>";
	            	}
	        	},
	            { "data": "date" },
	            { 
	            	data: "jumlah",
	            	render: function(data, type, row) {
	            		return data;
					} 
	            },
	            {
	            	"data": "coin"
	            },
	            { 
	            	"data": "type",
	            	render : function(data, type, row) {
	            		return data;
					} 
	            },
	            { "data": "server" }
	        ]
		});

		ajax.getHistoryResource(function(res) {
			if (res.data.status) {
				var datas = res.data.results;

				datas.Transactions.data.forEach(function(tranction) {
					pembelian.row.add(tranction).draw(false);
				});
				datas.Withdrawals.data.forEach(function(withdrawal) {
					penarikan.row.add(withdrawal).draw(false);
				});
				datas.Profits.data.forEach(function(profit) {
					penghasilan.row.add(profit).draw(false);
				});
			}
		});
	});

	$.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) { 
	    toastr["error"]('Ada yang salah saat prosess pengambilan data', 'Oops!');
	};
}];
var settingsCtrl = ['$scope', 'ajaxService', 'userService', function($scope, ajaxService, userService) {
	
	var user = new userService();
	var ajax = new ajaxService(user);

	$scope.error = false;
	$scope.users = {
		name: user.name,
		email: user.email,
		address: JSON.parse(atob(user.address))
	};

	$scope.saveUsers = function() {
		ajax.updateProfile($scope.users, function(res) {
			if (res.data.status) {
				user.name = $scope.users.name;
				user.email = $scope.users.email;
				user.address = btoa(JSON.stringify($scope.users.address));

				ajax.updateProfileData(user);

				toastr["success"]("Profil berhasil di update", "Update Profile");
			} else {
				toastr["error"]("Profil gagal di update", "Update Profile");
			}
		});
	};
	$scope.savePassword = function() {
		if (!equal($scope.password.new, $scope.password.newConfirm)) {
			$scope.error = true;
		} else {
			$scope.error = false;
			ajax.updatePassword($scope.password, function(res) {
				if (res.data.status) {
					toastr["success"]("Password berhasil di update", "Update Password");
				} else {
					toastr["error"]("Password gagal di update", "Update Password");
				}
			});
		}
	};
}];
var supportCtrl = ['$scope', 'ajaxService', '$routeParams', 'userService', function($scope, ajaxService, $routeParams, userService) {
	var user = new userService;
	var ajax = new ajaxService(user);

	$scope.isCreate = false;
	$scope.isList = false;
	
	switch($routeParams.page) {
		case 'create':
			$scope.isCreate = true;
			$scope.isList = false;
			break;
		case 'list': 
			$scope.isList = true;
			$scope.isCreate = false;

			var params = $.param({
				process: 'getTickets',
				db: 'Tickets',
				username: user.username,
				token: user.token,
				gatewayId: user.gatewayId
			})
			var tabelTicket = $('#tiket-table').DataTable({
				"ordering": false,
				"ajax": {
		            "url": baseUrl + params,
		            "dataType": "jsonp"
		        },
		        "columns": [
		            { "data": "id",
		            	render: function(data, type, row) {
		            		return "<a class='text-blue' href='#/p/ticket/" + data + "'>" + data + "</a>";
		            	}
		            },
		            { "data": "date" },
		            { "data": "subject" },
		            { 
		            	"data": "status",
		            	render : function(data, type, row) {
		            		return data;
						} 
		            },
		            {
			            "data": null,
			            render: function(data, type, row) {
			            	return '<label class="label label-danger" style="cursor: pointer;" onclick="angular.element(this).scope().doAction(\''+row.id+'\')">Closed</label>';
			            }
			        }
		        ]
			});
			$.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) { 
			    toastr["error"]('Ada yang salah saat prosess pengambilan data', 'Oops!');
			};
			break;
		default:
			$scope.isCreate = true;
			$scope.isList = true;
	}
	$scope.actions = [];

	// $compile($el)($scope);
	$scope.doAction = function(id) {
		ajax.ticket().closeTicket(id, function() {
			tabelTicket.ajax.reload();
		});
	}
	$scope.pushTicket = function() {
		ajax.createTicket({
			subject: $scope.ticket.subject,
			message: $scope.ticket.message,
			recaptcha: $("#g-recaptcha-response").val()
		}, function(res) {
			if (res.data.status) {
				toastr["info"](res.data.message + ", redirecting", 'Ticket');
				setTimeout(function() {
					document.location.href = "#/p/support/list";
				}, 1000);
			} else {
				toastr["error"]('Something went wrong!', 'Oops!');
			}
		});
	}
}];
var buyHashCtrl = ['$scope', 'ajaxService', 'userService', '$cookies', function($scope, ajaxService, userService, $cookies) {
	$scope.coin = 'eth';
	$scope.harga = base64decode($cookies.get(btoa('harga')));

	$scope.doProsess = function(hashrate, title) {
		var data = btoa(JSON.stringify({
			title: title,
			price: ($scope.harga * hashrate),
			hashrate: hashrate,
			coin: $scope.coin,
			server: 'Shared Server'
		}));
		jump('#/p/order/do/' + data);
	}
	$scope.custom = {
		hashrate: "5",
		harga: function() {
			return ($scope.custom.hashrate * $scope.harga);
		},
	}
	$scope.hargas = {
		shared: [
			{
				title: "Gold",
				caption: "Newbie",
				harga: ($scope.harga * 10),
				hashrate: "10",
				keterangan: [
					"5 Year",
					"Dikenakan Biaya Maintenance *(30%)"
				]
			},
			{
				title: "Platinum",
				caption: "Juragan",
				harga: ($scope.harga * 100),
				hashrate: "100",
				keterangan: [
					"5 Year",
					"Dikenakan Biaya Maintenance *(30%)"
				]
			},
			{
				title: "Diamond",
				caption: "Mastah",
				harga: ($scope.harga * 250),
				hashrate: "250",
				keterangan: [
					"5 Year",
					"Dikenakan Biaya Maintenance *(30%)"
				]
			}
		]
	}	
}];
var orderCtrl = ['$scope', 'ajaxService', '$routeParams', 'userService', '$cookies', function($scope, ajaxService, $routeParams, userService, $cookies) {
	$scope.order = JSON.parse(atob($routeParams.data));
	$scope.total = $scope.order.hashrate * base64decode($cookies.get(btoa('harga')));

	$scope.isNotBank = function() {
		return ($scope.order.method != "bank") ? true : false;
	};

	$scope.order.method = ($scope.order.coin == "eth") ? "bank" : "bitcoin";

	$scope.href = function() {
		if ($scope.order.method == "bank") {
			var needValidation = [
				(typeof $scope.order.atasnama == "undefined"),
				(typeof $scope.order.rekening == "undefined"),
				(typeof $scope.order.bank == "undefined")
			];
			if ($.inArray(true, needValidation) != -1) {
				toastr["error"]("Jika anda memilih metode bank, harap isi from tersebut", "Error");
			
				return false;
			}
		}
		var data = btoa(JSON.stringify({
			buy: {
				hashrate: $scope.order.hashrate,
				server: $scope.order.server,
				method: $scope.order.method,
				coin: $scope.order.coin
			},
			user: {
				rekening: $scope.order.rekening,
				atasnama: $scope.order.atasnama,
				bank: $scope.order.bank
			},
			tujuan: $scope.order.tujuan
		}));
		
		jump('#/p/process/do/' + data);
	}
}];
var processCtrl = ['$scope', 'ajaxService', '$routeParams', 'userService', '$cookies', function($scope, ajaxService, $routeParams, userService, $cookies) {
	var data = JSON.parse(atob($routeParams.data));

	$scope.deposit = {};

	$scope.isDone = false;
	$scope.getInvoice = {
		id: 'N/A',
		status: 'Loading..'
	}

	var user = new userService;
	var ajax = new ajaxService(user);

	ajax.requestInvoice(data, function(res) {
		if (res.data.status) {
			var payload = {
				method: data.buy.method,
				id: res.data.invoice,
				bayar: res.data.bayar,
				coin: data.buy.coin,
				rekening: res.data.rekening,
				deposit: res.data.deposit,
				server: res.data.server,
				coin: res.data.coin,
				method: res.data.method,
				hashrate: res.data.hashrate,
				timestamp: res.data.timestamp,
				expired: res.data.expired,
				fee: res.data.fee,
				total: res.data.total
			}
			console.log(payload);

			$cookies.put(btoa('invoice'), base64encode(JSON.stringify(payload)));

			setTimeout(function() {
				document.location.href = "#/invoice/" + res.data.invoice;
			}, 800);
		} 
	});

	$scope.user = user;
	$scope.buy = data;
}];
var invoiceCtrl = ['$scope', 'ajaxService', '$routeParams', 'userService', '$cookies', '$http', function($scope, ajaxService, $routeParams, userService, $cookies, $http) {
	var invoiceData = $cookies.get(btoa('invoice'));
	var user = new userService;

	$scope.isDone = false;

	var render = function(data) {
		console.log(data);

 		$scope.isBankMethod = (data.method == "bank") ? true : false;
 		$scope.isCoinMethod = (data.method == "bitcoin") ? true : false;

 		$scope.user = user;
 		$scope.rekenings = data.rekening;
 		$scope.deposit = data.deposit;

 		$scope.id = data.id;
 		$scope.today = new Date(data.timestamp).toString();

 		$scope.buy = data;
 		$scope.buy.title = data.server;

 		if (data.method == "bank") {
	 		$scope.harga = toRp(data.bayar);
	 		$scope.total = toRp(data.total);
	 		$scope.fee = toRp(data.fee);
 		} else {
	 		$scope.harga = (data.bayar * 1).toFixed(8) + " BTC";
	 		$scope.total = (data.total * 1).toFixed(8) + " BTC";
 		}

 		$scope.expires = data.expired;

 		$scope.isDone = true;
 	}
 	function getInvoiceById(callback) {
 		var params = $.param({
			process: "getInvoiceById",
			db: "Systems",
			username: user.username,
			token: user.token,
			id: $routeParams.id,
			gatewayId: user.gatewayId
		});
		$http.jsonp(baseUrl + params, {jsonpCallbackParam: 'callback'})
			.then(function(res) {
				if (res.data.status) {
					callback(res.data.results);
				} else {
					toastr["error"]("Something happend!", "Error");
				}
			});
 	}

	if (typeof invoiceData == "undefined") {
		// get Invoice status and data
		getInvoiceById(function(res) {
			render(res);
		});
	} else {
		invoiceData = JSON.parse(base64decode(invoiceData));

		if ($routeParams.id == invoiceData.id) {
			render(invoiceData);
		} else {
			// get Invoice status and data
			getInvoiceById(function(res) {
				render(res);
			});
		}
 	}
}];
var ticketCtrl = ['$scope', 'ajaxService', '$routeParams', 'userService', function($scope, ajaxService, $routeParams, userService) {
	var ticketId = "#" + $routeParams.id.substring(2);
	$scope.ticketId = ticketId;

	$scope.starter = {
		name: 'Loading',
		ticketId: ticketId,
		subject: 'Loading',
		data: 'Loading',
		status: 'open'
	};

	$scope.isClosed = function() {
		return ($scope.starter.status == "closed") ? true : false;
	}
	$scope.isStater = function(item) {
		if (item.type == "fromUser") {
			if (item.status != "") {
				$scope.starter = item;
				$scope.starter.ticketId = ticketId;
			}
			return true;
		} else {
			return false;
		}
	}
	$scope.isAdmin = function(item) {
		return (item.type == "fromAdmin") ? true : false;
	}

	var user = new userService;
	var ajax = new ajaxService(user);
	ajax.ticket().getTicket($routeParams.id, function(res) {
		$scope.replys = res.data.results;
	});

	$scope.replyTicket = function() {
		var date = new Date();
		var tgl = date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getDate()

		$scope.replys.push({
			message: btoa($scope.message),
			date: tgl,
			status: "",
			type: "fromUser",
			name: $scope.starter.name
		});
		ajax.ticket().replyTicket({
			ticketId: $routeParams.id,
			message: btoa($scope.message)
		});
	}
}];
var minersCtrl = ['$scope', '$http', 'userService', function($scope, $http, userService) {
	$scope.isLoading = true;
	var params = $.param({
		process: 'getTopMiners',
		db: 'Users'
	});
	$http.jsonp(baseUrl + params, {jsonpCallbackParam: 'callback'})
		.then(function(res) {
			if (res.data.status) {
				$scope.isLoading = false;
				$scope.miners = res.data.results;

				for (var min in $scope.miners) {

					if ($scope.miners[min].length < 7) {
						var kurang = 7 - $scope.miners[min].length;

						for (var i = 1; i <= kurang; i++) {
							console.log("push");
							$scope.miners[min].push({
								name: 'Slot Kosong',
								hash: 0,
								daftar: 'N/A'
							});
						}
					}
				}
			}
		}, errorCallbackAjax);
}];

var loginCtrl = ['$scope', 'ajaxService', function($scope, ajaxService) {
	$scope.loginForm = true;

	$scope.doLogin = function() {
		if ($scope.user.password != $scope.user.confirmPassword) {
			$scope.isError = true;
			toastr["error"]("Password yang anda masukkan tidak sama", "Error Confirm Password");
		} else {
			$scope.isError = false;
			$scope.user.recaptcha = $("#g-recaptcha-response").val();

			if (typeof $scope.user.recaptcha == "undefined") {
				toastr["error"]("Recaptcha harus di selesaikan", "Error Recaptcha");

				return false;
			} 

			var ajax = new ajaxService({
				username: '',
				token: ''
			});
			ajax.auth().login($scope.user, function(res) {
				if (res.data.status) {
					toastr["info"]("Konfirmasi Code 2FA", "2FA");
					$scope.loginForm = false;
				} else {
					toastr["error"](res.data.message, "Error");
				}
			});
		}
	};
	$scope.doConfirm = function() {
		var ajax = new ajaxService({
			username: '',
			token: ''
		});
		ajax.auth().confirm({
			token: $scope.user.token,
			username: $scope.user.username,
			password: $scope.user.password
		}, function(res) {
			if (res.data.status) {
				toastr["success"]("Login Successfuly", "Login");

				setTimeout(function() {
					jump('/');
				}, 1000);
			}
		});
	}
	$scope.goDaftar = function() {
		jump('/daftar.html');
	}
	$scope.isError = false;
}];
var registCtrl = ['$scope', 'ajaxService', function($scope, ajaxService) {
	$scope.doRegist = function() {
		if ($scope.user.password != $scope.user.confirmPassword) {
			$scope.isError = true;
		} else {
			if (!$scope.accept) {
				toastr["error"]("Harap menyetujui ketentuan yang berlaku", "Error");

				return false;
			}

			$scope.isError = false;

			var ajax = new ajaxService({
				username: '',
				token: ''
			});
			ajax.auth().regist($scope.user, function(res) {
				if (res.data.status) {
					toastr["success"]("silahkan Login menggunakan akun anda", "Registrasi Success");
					setTimeout(function() {
						document.location.href = "/login.html";
					}, 1000);
				} else {
					toastr["error"](res.data.message, "Error");
				}
			});
		}
	};
	$scope.jumpToLogin = function() {
		jump('/login.html');
	}
	$scope.isError = false;
}];
var logoutCtrl = ['$scope', 'ajaxService', 'userService', '$cookies', function($scope, ajaxService, userService, $cookies) {
	$scope.doLogout = function() {
		var user = new userService;
		var ajax = new ajaxService(user);

		ajax.auth().logout(function(res) {
			if (res.data.status) {
				$cookies.remove(btoa('harga'));
				$cookies.remove(btoa('users'));
				$cookies.remove(btoa('isLogin'));

				toastr["success"]("Logout berhasil, redirecting.", "Logout");
				
				setTimeout(function() {
					document.location.href = '/login.html';
				}, 1000);
			} else {
				toastr["error"]('Ada yang salah, dengan prosess Logout', 'Oops!');
			}
		});
	}
}];
var userService = ['$cookies', function($cookies) {
	var user = function() {
		if (!$cookies.get(btoa('isLogin'))) {
			document.location.href = '/login.html';
		} else {
			if (!$cookies.get(btoa('users'))) {
				document.location.href = '/login.html';
			}
			var users = JSON.parse(base64decode($cookies.get(btoa('users'))));

			return users;
		}
	}

	return user;
}];
var ajaxService = ['$http', '$window', '$cookies', function($http, $window, $cookies) {
	var ajax = function(data) {
		this.url = baseUrl;
		this.username = data.username;
		this.token = data.token;
		this.gatewayId = data.gatewayId;
	}
	
	ajax.prototype.auth = function() {
		var url = this.url,
			username = this.username,
			token = this.token;
			gatewayId = this.gatewayId;
		return {
			login: function(data, callback) {
				var payload = JSON.stringify(data);
				var params = $.param({
					process: 'sign-in',
					db: 'Users',
					data: btoa(payload),
					gatewayId: gatewayId
				});

				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
					.then(function(res) {
						callback(res);
					}, errorCallbackAjax);
			},
			regist: function(data, callback) {
				var payload = JSON.stringify(data);
				var params = $.param({
					process: 'sign-up',
					db: 'Users',
					data: btoa(payload),
					gatewayId: gatewayId
				});

				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
					.then(function(res) {
						callback(res);
					}, errorCallbackAjax);
			},
			logout: function(callback) {
				var params = $.param({
					process: 'sign-out',
					db: 'Users',
					username: username,
					token: token,
					gatewayId: gatewayId
				});
				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'}).then(function(res) {
					callback(res);
				}, errorCallbackAjax);
			},
			confirm: function(data, callback) {
				var params = $.param({
					process: 'confirmCode',
					db: 'Users',
					data: btoa(JSON.stringify(data))
				});
				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'}).then(function(res) {
					if (res.data.status) {
						var expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 3);
						
						$cookies.put(btoa('isLogin'), true, {
							expires : expireDate
						});
						$cookies.put(btoa('users'), base64encode(JSON.stringify(res.data.user)), {
							expires: expireDate
						});
						$cookies.put(btoa('harga'), base64encode(res.data.harga), {
							expires : expireDate
						});
					}
					callback(res);
				}, errorCallbackAjax);
			}
		}
	}
	ajax.prototype.getLastPrice = function(callback) {
		var params = $.param({
			process: 'getLastPrice',
			db: 'Systems',
			username: this.username,
			token: this.token,
			gatewayId: this.gatewayId
		});
		$http.jsonp(this.url + params, {jsonpCallbackParam: 'callback'}).then(function(res) {
			callback(res);
		}, errorCallbackAjax);
	};
	ajax.prototype.getDashboard = function(callback) {
		// do get ajax earning
		// do get ajax bitcoin market rupiah
		var params = $.param({
			process: 'getDashboardResource',
			db: 'Systems',
			token: this.token,
			username: this.username,
			gatewayId: this.gatewayId
		});
		$http.jsonp(this.url + params, {jsonpCallbackParam: 'callback'}).then(function(res) {
			callback(res);
		}, errorCallbackAjax);
	}
	ajax.prototype.getHistoryResource = function(callback) {
		var params = $.param({
			process: 'getHistoryResource',
			db: 'Systems',
			username: this.username,
			token: this.token,
			gatewayId: this.gatewayId
		});

		$http.jsonp(this.url + params, {jsonpCallbackParam: 'callback'})
			.then(function(res) {
				if (res.data.status) {
					callback(res);
				} else {
					toastr["error"](res.data.message, "Error");
				}
			}, errorCallbackAjax);
	}
	ajax.prototype.updateProfileData = function(data) {
		
		$cookies.put(btoa('users'), base64encode(JSON.stringify(data)));
	}
	ajax.prototype.updateProfile = function(body, callback) {
		// do update profile 
		var data = btoa(JSON.stringify({
			edit: 'profile',
			profile: {
				name: body.name,
				email: body.email,
				address: body.address
			}
		}));
		var params = $.param({
			process: 'updateProfile',
			db: 'Users',
			data: data,
			username: this.username,
			token: this.token,
			gatewayId: this.gatewayId
		});

		$http.jsonp(this.url + params, {jsonpCallbackParam: 'callback'})
			.then(function(res) {
				if (res.data.status) {
					callback(res);
				} else {
					toastr["error"](res.data.message, "Error");
				}
			}, errorCallbackAjax);
	}
	ajax.prototype.updatePassword = function(body, callback) {
		// do update profile
		// @param token, old, new
		var data = btoa(JSON.stringify({
			edit: 'password',
			profile: {
				oldP: body.old,
				newP: body.new
			}
		}));
		var params = $.param({
			process: 'updateProfile',
			db: 'Users',
			data: data,
			username: this.username,
			token: this.token,
			gatewayId: this.gatewayId
		});

		$http.jsonp(this.url + params, {jsonpCallbackParam: 'callback'})
			.then(function(res) {
				if (res.data.status) {
					callback(res);
				} else {
					toastr["error"](res.data.message, "Error");
				}
			}, errorCallbackAjax);
	}
	ajax.prototype.createTicket = function(data, callback) {
		// do create ticket 
		// @param token, subject, message
		var url = this.url;
		var temp = {
			subject: data.subject,
			message: data.message,
			recaptcha: data.recaptcha
		}
		var params = $.param({
			process: 'pushTicket',
			db: 'Tickets',
			username: this.username,
			token: this.token,
			data: btoa(JSON.stringify(temp)),
			gatewayId: this.gatewayId
		})
		$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
			.then(function(res) {
				if (res.data.status) {
					callback(res);
				} else {
					toastr["error"](res.data.message, "Error");
				}
			}, errorCallbackAjax);
	}
	ajax.prototype.ticket = function() {
		var url = this.url,
			username = this.username,
			token = this.token,
			gatewayId = this.gatewayId;
		return {
			getTicket: function(id, callback) {
				var params = $.param({
					process: 'getTicket',
					db: 'Tickets',
					username: username,
					token: token,
					id: id,
					gatewayId: gatewayId
				})
				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
					.then(function(res) {
						callback(res);
					}, errorCallbackAjax);
			},
			replyTicket: function(data) {
				var datas = btoa(JSON.stringify(data));
				var params = $.param({
					process: 'replyTicket',
					db: 'Tickets',
					username: username,
					token: token,
					data: datas,
					gatewayId: gatewayId
				});	

				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
					.then(function(res) {
						if (res.data.status) {
							toastr["success"]("Ticket, replyed", "Ticket");
						}
					});
			},
			closeTicket: function(id, callback) {
				var params = $.param({
					process: 'setTicket',
					db: 'Tickets',
					username: username,
					token: token,
					id: id,
					gatewayId: gatewayId
				});
				$http.jsonp(url + params, {jsonpCallbackParam: 'callback'})
					.then(function(res) {
						if (res.data.status) {
							toastr["success"]("Ticket closed, reloading", "Ticket");

							setTimeout(function() {
								callback();
							}, 1000);
						}
					});
			}
		}
	}
	ajax.prototype.requestInvoice = function(data, callback) {
		var username = this.username;
		var token = this.token;
		var gatewayId = this.gatewayId;

		$http.jsonp("//freegeoip.net/json/", {jsonpCallbackParam: 'callback'}).then(function(res) {
			var clientDetails = btoa(JSON.stringify(res.data));

			var params = $.param({
				process: 'getInvoice',
				db: 'Systems',
				data: btoa(JSON.stringify(data)),
				client: clientDetails,
				username: username,
				token: token,
				gatewayId: gatewayId
			});
			$http.jsonp(baseUrl + params, {jsonpCallbackParam: 'callback'})
				.then(function(res) {
					callback(res);
				}, errorCallbackAjax);
		});
	}

	return ajax;
}];
var routeModule = ['$routeProvider', '$locationProvider',  '$sceDelegateProvider', function($routeProvider, $locationProvider, $sceDelegateProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeCtrl'
		})
		.when('/p/buy', {
			templateUrl: 'pages/buy.html',
			controller: 'buyHashCtrl'
		})
		.when('/p/miners', {
			templateUrl: 'pages/miners.html',
			controller: 'minersCtrl'
		})
		.when('/p/order/do/:data', {
			templateUrl: 'pages/order.html',
			controller: 'orderCtrl'
		})
		.when('/p/process/do/:data', {
			templateUrl: 'pages/proses.html',
			controller: 'processCtrl'
		})
		.when('/invoice/:id', {
			templateUrl: 'pages/invoice.html',
			controller: 'invoiceCtrl'
		})
		.when('/p/history', {
			templateUrl: 'pages/history.html',
			controller: 'historyCtrl'
		})
		.when('/p/settings', {
			templateUrl: 'pages/settings.html',
			controller: 'settingsCtrl'
		})
		.when('/p/support/:page?', {
			templateUrl: 'pages/support.html',
			controller: 'supportCtrl'
		})
		.when('/p/ticket/:id?', {
			templateUrl: 'pages/ticket.html',
			controller: 'ticketCtrl'
		});
	
	$locationProvider.hashPrefix('');
	$sceDelegateProvider.resourceUrlWhitelist(['**']);
}];

var equal = function(a, b) {
	return (a == b) ? true : false;
};
var jump = function(url) {

	document.location.href = url;
}
var base64decode = function(c) {
	var parser = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	for (var i = parser.length - 2; i >= 0; i--) {
		parser.toString().split('').reverse().join('');
	}
	var rawHash = "w";
	var hashDigit = CryptoJS;
	return hashDigit.AES.decrypt(c.toString(), parser).toString(hashDigit.enc.Utf8);
	for (i = 0; i < rawHash.length; i++) {
		var hashVal = rawHash[i];
		if (hashVal < 0) {
			pars = 5;
		}
	}
}
var base64encode = function(c) {
	var parser = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	for (var i = parser.length - 1; i >= 0; i--) {
		parser.toString().split('').reverse().join('');
	}
	var rawHash = "s";
	var hashDigit = CryptoJS;
	return hashDigit.AES.encrypt(c.toString(), parser).toString();
	for (i = 0; i < rawHash.length; i++) {
		var hashVal = rawHash[i];
		if (hashVal < 0) {
			pars = 1;
		}
	}
}
var errorCallbackAjax = function(res) {
	toastr["error"]("Something went wrong", "Error");
}
function toRp(angka) {
	var rupiah = '';    
	var angkarev = angka.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}
angular.module('nyanHash', ['ngRoute', 'ngCookies'])
	.config(routeModule)
	.controller('navigationCtrl', navigationCtrl)
	.controller('homeCtrl', homeCtrl)	
	.controller('buyHashCtrl', buyHashCtrl)
	.controller('processCtrl', processCtrl)
	.controller('historyCtrl', historyCtrl)
	.controller('settingsCtrl', settingsCtrl)
	.controller('supportCtrl', supportCtrl)
	.controller('orderCtrl', orderCtrl)
	.controller('invoiceCtrl', invoiceCtrl)
	.controller('ticketCtrl', ticketCtrl)
	.controller('minersCtrl', minersCtrl)
	.controller('loginCtrl', loginCtrl)
	.controller('registCtrl', registCtrl)
	.controller('logoutCtrl', logoutCtrl)
	.filter('atob', function(){
		return function(text){
			return atob(text);
		}
	})
	.filter('rupiah', function() {
		return function(angka) {
			var rupiah = '';    
			var angkarev = angka.toString().split('').reverse().join('');
			for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
			return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
		}
	})
	.filter('btoa', function(){
	
		return function(text){
			return btoa(text);
		}
	})
	.filter('toFixed', function(){
	
		return function(text){
			return (text * 1).toFixed(8);
		}
	})
	.factory('ajaxService', ajaxService)
	.factory('userService', userService);