import React from 'react';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		// État initial de la calculatrice
		this.state = {
			buttons: [
				// Les boutons avec leurs propriétés
				{
					id: 'clear',
					value: 'AC',
					function: () => this.clear(),
					className: 'ac'
				},
				{
					id: 'divide',
					value: '/',
					function: (event) => this.operator(event),
					className: 'operator'
				},
				{
					id: 'multiply',
					value: '*',
					function: (event) => this.operator(event),
					className: 'operator'
				},
				{
					id: 'seven',
					value: 7,
					function: (event) => this.write(event),
					className: 'number',
				},
				{
					id: 'eight',
					value: 8,
					function: (event) => this.write(event),
					className: 'number',
				},
				{
					id: 'nine',
					value: 9,
					function: (event) => this.write(event),
					className: 'number',
				},
				{
					id: 'subtract',
					value: '-',
					function: (event) => this.operator(event),
					className: 'operator'
				},
				{
					id: 'four',
					value: 4,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'five',
					value: 5,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'six',
					value: 6,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'add',
					value: '+',
					function: (event) => this.operator(event),
					className: 'operator'
				},
				{
					id: 'one',
					value: 1,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'two',
					value: 2,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'three',
					value: 3,
					function: (event) => this.write(event),
					className: 'number'
				},
				{
					id: 'equals',
					value: '=',
					function: (event) => this.result(event),
					className: 'equal'
				},
				{
					id: 'zero',
					value: 0,
					function: (event) => this.write(event),
					className: 'number zero',
					colSpan: 2
				},
				{
					id: 'decimal',
					value: '.',
					function: (event) => this.write(event),
					className: 'decimal'
				}
			],
			allDisplay: 0, // Historique de l'entrée
			display: 0 // Affichage actuel
		};

		// Liaison des méthodes à l'instance de la classe
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.write = this.write.bind(this);
		this.operator = this.operator.bind(this);
		this.clear = this.clear.bind(this);
		this.result = this.result.bind(this);
	}

	// Méthode pour obtenir un élément de bouton par sa valeur
	getElementByValue(value) {
		const allElements = document.getElementsByTagName('button');
		for (let i = 0; i < allElements.length; i++) {
			const element = allElements[i];
			if (element.value === value) {
				return element;
			}
		}
		return null; // Renvoie null si aucun élément avec la valeur recherchée n'est trouvé
	}

	componentDidMount() {
		// Ajout de l'écouteur d'événement lors du montage du composant
		document.addEventListener('keydown', this.handleKeyDown);
	}

	componentWillUnmount() {
		// Retrait de l'écouteur d'événement lors du démontage du composant
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown(event) {
		// Gestion des touches du clavier
		console.log();
		const focusableElements = document.querySelectorAll('button');

		focusableElements.forEach((element) => {
			element.blur();
		});
		if (/^[0-9.]+$/.test(event.key)) {
			this.write({ target: { value: event.key } });
		} else if (/[-+*/]/.test(event.key)) {
			this.operator({ target: { value: event.key } });
		} else if (event.key === 'Enter') {
			this.result();
		} else if (event.key === 'Backspace') {
			this.clear();
		}
	}

	write(event) {
		// Fonctionnalité d'écriture des chiffres et opérateurs

		// S'assurer que le bouton du clavier est flouté pour éviter une mauvaise utilisation qui pourrait entraîner une double entrée.
		this.getElementByValue(event.target.value).blur();
		if (!isNaN(event.target.value)) {
			// Ajouter la valeur au champ de saisie actuel et à l'historique complet si la valeur de l'événement est un nombre.

			this.setState({
				...this.state,
				allDisplay: this.state.allDisplay + event.target.value,
				display: this.state.display + event.target.value
			});

			if (/[-+*/]/.test(this.state.display)) {
				// Créer un nouvel affichage avec la valeur si un opérateur est déjà présent.

				this.setState({
					...this.state,
					allDisplay: this.state.allDisplay + event.target.value,
					display: event.target.value
				});
			}
		} else {
			if (/[/*\-+.]/.test(this.state.display) && event.target.value === '.') {
				// Empêcher d'ajouter plusieurs points décimaux dans un nombre.

				this.setState({ ...this.state });
			} else {
				this.setState({
					...this.state,
					allDisplay: this.state.allDisplay + event.target.value,
					display: this.state.display + event.target.value
				});
			}
		}
	}

	operator(event) {
		// S'assurer que le bouton du clavier est flouté pour éviter une mauvaise utilisation qui pourrait entraîner une double entrée.
		this.getElementByValue(event.target.value).blur();

		// Obtenir les deux derniers caractères de l'affichage actuel
		let twoLastArgument = this.state.allDisplay.slice(-2);

		// Cas 1: Si le dernier caractère n'est pas un nombre
		if (isNaN(twoLastArgument[1]) === false) {
			// Mettre à jour l'affichage avec l'opérateur
			this.setState({
				...this.state,
				allDisplay: this.state.allDisplay + event.target.value,
				display: event.target.value
			});
			// Cas 2: Si le premier caractère est un nombre et le second n'en est pas un
		} else if (isNaN(twoLastArgument[0]) === false && isNaN(twoLastArgument[1]) === true) {
			// Si l'opérateur est un signe négatif
			if (event.target.value === '-') {
				// Mettre à jour l'affichage avec le signe négatif
				this.setState({
					...this.state,
					allDisplay: this.state.allDisplay + event.target.value,
					display: event.target.value
				});
				// Sinon, s'il s'agit d'un autre opérateur
			} else {
				// Supprimer le dernier caractère et ajouter le nouvel opérateur
				this.setState({
					...this.state,
					allDisplay: this.state.allDisplay.slice(0, -1) + event.target.value,
					display: event.target.value
				});
			}
			// Cas 3: Si ni le premier ni le second caractère ne sont des nombres
		} else if (isNaN(twoLastArgument[0]) === true && isNaN(twoLastArgument[1]) === true) {
			this.setState({ ...this.state });
		}
	}

	clear() {
		// Obtenir le bouton de suppression (effacement)
		const clearButton = document.getElementById('clear');
		clearButton.blur();

		// Réinitialiser l'état de l'affichage
		this.setState({ ...this.state, display: 0, allDisplay: 0 });
	}

	result() {
		const calcul = this.state.allDisplay;
		const clearButton = document.getElementById('equals');
		clearButton.blur();

		// Initialisation des tableaux de calcul
		let calculArray = [];
		let operatorsIndex = [];
		let result = 0;
		let operator = '';

		// Parcours de l'expression de calcul
		for (let i = 0; i <= calcul.length; i++) {
			// Vérification si le caractère à l'indice 'i' est un opérateur (+, -, *, ou /)
			if (/[/\-*+]/.test(calcul[i])) {
				// Si c'est le cas, on enregistre l'indice de cet opérateur dans le tableau 'operatorsIndex'
				operatorsIndex.push(i);

				// Ensuite, on vérifie si l'opérateur est un '-' et s'il suit immédiatement un autre opérateur
				if (calcul[i] === '-' && operatorsIndex.includes(i - 1)) {
					// Si c'est le cas, on retire l'indice précédemment ajouté à 'operatorsIndex'
					operatorsIndex.pop();
				}
			}
		}

		// Découpage de l'expression en sous-éléments (nombres et opérateurs)
		for (let j = 0; j <= operatorsIndex.length; j++) {
			if (j === 0) {
				calculArray.push(calcul.slice(0, operatorsIndex[j]));
			} else if (j === operatorsIndex.length) {
				calculArray.push(calcul.slice(operatorsIndex[j - 1]));
			} else {
				calculArray.push(calcul.slice(operatorsIndex[j - 1], operatorsIndex[j]));
			}
		}

		// Calcul du résultat
		let indexWhile = 0;
		while (indexWhile < calculArray.length) {
			let number = calculArray[indexWhile];
			if (indexWhile === 0) {
				result = parseFloat(number);
			} else {
				operator = number.slice(0, 1);
				switch (operator) {
					case '+':
						number = number.slice(1, number.length);
						result += parseFloat(number);
						break;
					case '-':
						number = number.slice(1, number.length);
						result -= parseFloat(number);
						break;
					case '*':
						number = number.slice(1, number.length);
						result *= parseFloat(number);
						break;
					case '/':
						number = number.slice(1, number.length);
						result /= parseFloat(number);
						break;
				}
			}

			indexWhile++;
		}

		// Mise à jour de l'affichage avec le résultat
		this.setState({ ...this.state, allDisplay: result.toString(), display: result.toString() });
	}

	render() {
		// Génération des boutons à partir de l'état
		const buttons = this.state.buttons.map((element) => {
			return (
				<button
					id={element.id}
					className={element.className}
					value={element.value}
					onClick={element.function}
					onKeyDown={this.handleKeyDown}
				>
					{element.value}
				</button>
			);
		});

		// Affichage de la calculatrice
		return (
			<div className="calculator">
				<div className="resume">{parseFloat(this.state.allDisplay)}</div>
				<div id="display" className="display">
					{this.state.display ? isNaN(this.state.display) ? (
						this.state.display
					) : (
						parseFloat(this.state.display)
					) : (
						0
					)}
				</div>
				<div className="buttons">{buttons}</div>
			</div>
		);
	}
}

export default App;
