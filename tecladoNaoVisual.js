var TCL_Keyboard;

TCL_Keyboard = (function () {
	var Teclado = {},
		self = Teclado;

	Teclado.TCL_LayoutSelecionado = 'Portugues-Brasileiro-ABNT2';
	Teclado.TCL_InputPadrao = '';
	Teclado.TCL_PermiteDiacriticos = true;
	Teclado.TCL_AcentoExtra = undefined;
	Teclado.TCL_CaracterNulo = '';
	Teclado.TCL_AttachElement = undefined;

	Teclado.TCL_shift = Teclado.TCL_shiftLock = false;

	/*
		Layouts
	 */
	Teclado.TCL_Layouts = {};

	/*
		Layout Teclado Brasileiro ABNT2
	 */
	Teclado.TCL_Layouts['Portugues-Brasileiro-ABNT2'] = {
		nome: 'br-ABNT2',
		codigoASCII: [
			[192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8],
			[9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221],
			[160, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 220],
			[160, 226, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 193, 160],
			[32]
		],
		teclas: [
			[["'", '"'], ['1','!'], ['2','@'], ['3','#'], ['4','$'], ['5','%'], ['6','\u00a8'], ['7','&'], ['8','*'], ['9','('], ['0',')'], ['-','_'], ['=','+'], ['Bksp','Bksp']],
			[['Tab','Tab'], ['q','Q'], ['w','W'], ['e','E'], ['r','R'], ['t','T'], ['y','Y'], ['u','U'], ['i','I'], ['o','O'], ['p','P'], ['\u00b4','\u0060'], ['[','{']],
			[['Caps','Caps'], ['a','A'], ['s','S'], ['d','D'], ['f','F'], ['g','G'], ['h','H'], ['j','J'], ['k','K'], ['l','L'], ["\u00e7", "\u00c7"], ['~','^'], [']','}']],
			[['Shift','Shift'], ['\\','|'], ['z','Z'], ['x','X'], ['c','C'], ['v','V'], ['b','B'], ['n','N'], ['m','M'], [',', '<'], ['.','>'], [';',':'], ['/','?'], ['Shift', 'Shift']],
			[[' ']]
		]
	};

	/*
		Diacríticos ("Acentos")
	 */
	Teclado.TCL_Diacriticos = {};

	Teclado.TCL_Diacriticos['\u0060'] = { // Acento Grave
		'a': '\u00E0', 'A': '\u00C0'
	};

	Teclado.TCL_Diacriticos['\u00B4'] = { // Acento Agudo
		'a': '\u00E1', 'A': '\u00C1', 'e': '\u00E9', 'E': '\u00C9', 'i': '\u00ED', 'I': '\u00CD', 'o': '\u00F3', 'O': '\u00D3', 'u': '\u00FA', 'U': '\u00DA'
	};

	Teclado.TCL_Diacriticos['\u005E'] = { // Acento Circunflexo
		'a': '\u00E2', 'A': '\u00C2', 'e': '\u00EA', 'E': '\u00CA', 'o': '\u00F4', 'O': '\u00D4'
	};

	Teclado.TCL_Diacriticos['\u007E'] = { // Til
		'a': '\u00E3', 'A': '\u00C3', 'o': '\u00F5', 'O': '\u00D5'
	};

	/*
		Teclado Numérico
	 */
	Teclado.TCL_Numerico = {
		codigoASCII: [
			[160, 111, 106, 109],
			[103, 104, 105, 107],
			[100, 101, 102, 194],
			[ 97,  98,  99, 160],
			[ 96, 160, 110, 160]
		],
		teclas: [
			[' ', '/', '*', '-'],
			['7', '8', '9', '+'],
			['4', '5', '6', '.'],
			['1', '2', '3', ' '],
			['0', ' ', ',', ' ']
		]
	};

	Teclado.TCL_MouseEventsDefault = function (elemento) {
		if ($(elemento).nodeType == 'TD')
			$(elemento).bind('dblclick', function () {
				return false;
			})

		$(elemento).hover(
			function () {
				return false;
			},
			function () {
				return false;
			}
		);

		$(elemento).bind('mousedown', function () {
			return false;
		});

		$(elemento).bind('mouseup', function () {
			return false;
		});
	};

	Teclado.TCL_KeyboardEvents = function () {
		$(document).bind('keydown', function (evt) {
			var achou = false;

			console.log(evt.which);

			if (evt.shiftKey && !self.TCL_shift && !self.TCL_shiftLock)
				self.TCL_ModificarTeclas('Shift');
			else if (evt.which == 20)
				self.TCL_ModificarTeclas('Caps');

			switch (evt.which) {
				case 8: // Backspace
					self.TCL_Backspace();

					break;
				case 9: // Tab
					self.TCL_AplicarTab();

					break;
				default:
					function EventoTeclaDisparar(teclado, numerico) {
						$(teclado.codigoASCII).each(function (i, val) {
							$(val).each(function (j, value) {
								var elementoTeclado;
								
								if (numerico)
									elementoTeclado = $('#tecladoNumerico table tbody tr').eq(i);
								else
									elementoTeclado = $('#tecladoAlfanumerico table tbody tr').eq(i);

								elementoTeclado = $(elementoTeclado).children().eq(j);

								if (evt.which === value) {
									achou = true;

									$(elementoTeclado).trigger('mousedown');
									self.TCL_TeclaClick(elementoTeclado);

									return false;
								}
							});

							if (achou)
								return false;
						});
					};

					EventoTeclaDisparar(self.TCL_Layouts[self.TCL_LayoutSelecionado]);
					EventoTeclaDisparar(self.TCL_Numerico, true);

					break;
			}

			return false;
		});

		$(document).bind('keyup', function (evt) {
			var achou = false;
			
			if (!evt.shiftKey && self.TCL_shift && !self.TCL_shiftLock)
				self.TCL_ModificarTeclas('Shift');

			$(self.TCL_Layouts[self.TCL_LayoutSelecionado].codigoASCII).each(function (i, val) {
				$(self.TCL_Layouts[self.TCL_LayoutSelecionado].codigoASCII[i]).each(function (j, value) {
					var elementoTeclado;
					
					elementoTeclado = $('#tecladoTabela tr').eq(i);
					elementoTeclado = $(elementoTeclado).children().eq(j);

					if (evt.which === value) {
						achou = true;
						$(elementoTeclado).trigger('mouseup');
					}
				});

				if (achou)
					return false;
			});

			return false;
		});
	};

	Teclado.TCL_Inserir = function (texto) {
		var textoAnterior = $(self.TCL_InputPadrao).text();
		$(self.TCL_InputPadrao).text(textoAnterior + texto);
		//console.log(self.TCL_InputPadrao);
	};

	Teclado.TCL_Backspace = function () {
		var textoAnterior = $(self.TCL_InputPadrao).text();

		$(self.TCL_InputPadrao).text(String(textoAnterior).substr(0, String(textoAnterior).length - 1));
	};

	Teclado.TCL_AplicarTab = function () {

	};

	Teclado.TCL_ModificarTeclas = function (tipo) {
		switch (tipo) {
			case 'Shift':
				Teclado.TCL_shift = !Teclado.TCL_shift;

				break;
			case 'Caps':
				Teclado.TCL_shift = 0;
				Teclado.TCL_shiftLock = !Teclado.TCL_shiftLock;

				break;
		}

		var vchar = 0;

		if (!Teclado.TCL_shift != !Teclado.TCL_shiftLock)
			vchar += 1;

		$('#tecladoAlfanumerico table tbody').children().each(function (i, teclas) {
			var self_i = i;

			$(teclas).children().each(function (j, value) {
				var className = [],
					tecla = self.TCL_Layouts[self.TCL_LayoutSelecionado].teclas[self_i][j];

					switch (tecla[1]) {
						case 'Shift':
							if (self.TCL_shift)
								className.push('pressed');

							break;
						case 'Caps':
							if (self.TCL_shiftLock)
								className.push('pressed');

							break;
						case 'Tab':
						case 'Bksp':
							break;
						default:
							if (tipo)
								$(value).text(tecla[vchar] || self.TCL_CaracterNulo);

							break;
					}

				if (tecla[0] == " " || tecla[1] == " ")
					className.push("space");

				$(value).className = className.join(' ');
			});
		});
	};

	Teclado.TCL_TeclaClick = function (elemento) {
		var pronto = false,
			caracter = self.TCL_CaracterNulo;

		if ((caracter = $(elemento).text()) == self.TCL_CaracterNulo)
			return false;

		if (self.TCL_PermiteDiacriticos && self.TCL_AcentoExtra) {
			if (self.TCL_AcentoExtra != caracter) {
				if (caracter != ' ') {
					if (self.TCL_Diacriticos[self.TCL_AcentoExtra][caracter]) {
						self.TCL_Inserir(self.TCL_Diacriticos[self.TCL_AcentoExtra][caracter]);
						pronto = true;
					}
				} else {
					self.TCL_Inserir(self.TCL_AcentoExtra);
					pronto = true;
				}
			} else
				pronto = true;
		}

		self.TCL_AcentoExtra = undefined;

		if (!pronto) {
			if (self.TCL_PermiteDiacriticos && self.TCL_Diacriticos[caracter]) {
				self.TCL_AcentoExtra = caracter;

				if (self.TCL_shift)
					self.TCL_ModificarTeclas('Shift');
			} else
				self.TCL_Inserir(caracter);
		}

		self.TCL_ModificarTeclas('');

		return false;
	};

	Teclado.TCL_MostrarTeclado = function (elemento) {
		self.TCL_AttachElement = elemento;

		self.construirTeclas();
		self.TCL_KeyboardEvents();
	};

	Teclado.construirTeclas = function () {
		var tecladoAlfa = $('<div>').attr('id', 'tecladoAlfanumerico')
				.css('float', 'left')
				.appendTo(self.TCL_AttachElement),
			tecladoNumerico = $('<div>').attr('id', 'tecladoNumerico')
				.css({
					'float': 'left',
					'margin-left': '10px'
				})
				.appendTo(self.TCL_AttachElement);


		for (var i = 0, layout; layout = self.TCL_Layouts[self.TCL_LayoutSelecionado].teclas[i++]; ) {
			var tabelaContainer = $('<table>')
									.attr('id','tecladoTabela')
									.attr('cellspacing','0')
									.appendTo(tecladoAlfa);

			var corpoTabela = $('<tbody>').appendTo(tabelaContainer);
			var linhaTabela = $('<tr>').appendTo(corpoTabela);

			for (var j = 0, tecla; tecla = layout[j++]; ) {
				var celula = $('<td>')
								.text(tecla[0] || self.TCL_CaracterNulo)
								.appendTo(linhaTabela);

				if (tecla[0] == ' ')
					$(celula).addClass('space');

				// Eventos Teclas Especiais
				switch (tecla[1]) {
					case 'Shift':
					case 'Caps':
						$(celula).bind('click', {tipo: tecla[1]}, function (evt) {
							self.TCL_ModificarTeclas(evt.data.tipo);

							return false;
						});

						break;
					case 'Bksp':
						$(celula).bind('click', function (evt) {
							self.TCL_Backspace();

							return false;
						});
						break;
					case 'Tab':
						$(celula).bind('click', function (evt) {
							self.TCL_AplicarTab();

							return false;
						});

						break;
					default:
						$(celula).bind('click', {elemento: $(celula)}, function (evt) {
							self.TCL_TeclaClick(evt.data.elemento);

							return false;
						});

						break;
				}

				self.TCL_MouseEventsDefault($(celula));
			};
		}

		for (var k = 0, linha; linha = self.TCL_Numerico.teclas[k++]; ) {
			var tabelaContainer = $('<table>')
									.attr('id','tecladoNumericoTabela')
									.attr('cellspacing','0')
									.appendTo(tecladoNumerico);

			var corpoTabela = $('<tbody>').appendTo(tabelaContainer);
			var linhaTabela = $('<tr>').appendTo(corpoTabela);

			for (var p = 0, coluna; coluna = linha[p++]; ) {
				var celula = $('<td>')
								.text(coluna || self.TCL_CaracterNulo)
								.appendTo(linhaTabela);

				$(celula).bind('click', {elemento: $(celula)}, function (evt) {
					self.TCL_TeclaClick(evt.data.elemento);

					return false;
				});

				self.TCL_MouseEventsDefault($(celula));
			}
		}
	};

	return Teclado;
})();