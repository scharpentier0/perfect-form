import { TextualInput } from '@src/TextualInput';
let inputBase = { label: 'My Input', name: 'myInput' };

describe('Input', () => {
	it('Has a unique ID', () => {
		let txtInpt = new TextualInput({ ...inputBase });
		expect(txtInpt.id).not.toBeUndefined();
		expect(typeof txtInpt.id).toBe('string');
		expect(txtInpt.id.length).toBeGreaterThanOrEqual(1);
	});
});

describe('TextualInput', () => {
	it('Validate a string value', () => {
		let txtInpt = new TextualInput({ ...inputBase });

		txtInpt.required = false;
		txtInpt.value = 'This is a string';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = 'A';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '';
		expect(txtInpt.isValid).toBe(true);
	});

	it('Invalidate all non string values', () => {
		let txtInpt = new TextualInput({ ...inputBase });

		txtInpt.value = 200;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 0;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = false;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = true;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = ['This is a string array'];
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = { key: 'This is an object' };
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = new Set(['This is a string array']);
		expect(txtInpt.isValid).toBe(false);
	});

	it('Requires a value when required', () => {
		let txtInpt = new TextualInput({ ...inputBase, required: true });

		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 'My value';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '';
		expect(txtInpt.isValid).toBe(false);
	});

	it('Handles input hinting properly', () => {
		let txtInpt = new TextualInput({
			...inputBase,
			required: true,
			hintsInstructions: [{ regexp: /.+/, message: 'This input is required' }],
		});

		txtInpt.updateHint();
		expect(txtInpt.hints).toStrictEqual(['This input is required']);
		txtInpt.value = 'My value';
		txtInpt.updateHint();
		expect(txtInpt.hints).toStrictEqual([]);
	});

	it('Validate input pattern properly', () => {
		let testedRegexp = /[0-9].*[0-9]/;
		let txtInpt = new TextualInput({
			...inputBase,
			required: true,
			pattern: testedRegexp,
		});

		txtInpt.value = 'This is just a string';
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 'This is just a string 12';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '1This is just a string 2';
		expect(txtInpt.isValid).toBe(true);
	});

	it('Returns given value untouched', () => {
		let txtInpt = new TextualInput({ ...inputBase });
		txtInpt.value = 'George';
		expect(txtInpt.value).toBe('George');
	});
	it('Can be masked', () => {
		let txtInpt = new TextualInput({ ...inputBase, mask: '000 $' });
		expect(txtInpt.mask).toBe('000 $');
	});
});

import { NumericalInput } from '@src/NumericalInput';
describe('NumericalInputs', () => {
	it('Validates numerical string value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = '2';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '0025846';
		expect(nbrInpt.isValid).toBe(true);

		nbrInpt.value = '';
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Converts native numbers into strings', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = 66;
		expect(nbrInpt.value).toBe('66');
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Converts invalid values into empty strings', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true });
		nbrInpt.value = 'This is not a number';
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = { value: '0' };
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = [6, 3, 13];
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = undefined;
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = null;
		expect(nbrInpt.value).toBe('');
	});
	it('Invalidates empty value when required', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true });
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '65px';
		expect(nbrInpt.value).toBe('65');
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Handles integers correctly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, type: 'integers' });
		nbrInpt.value = '55.2';
		expect(nbrInpt.valueAsNumber).toBe(55);
		expect(nbrInpt.value).toBe('55');
		nbrInpt.value = '33';
		expect(nbrInpt.valueAsNumber).toBe(33);
		expect(nbrInpt.value).toBe('33');
	});

	it('Handles floats correctly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, type: 'floats' });
		nbrInpt.value = '55.2';
		expect(nbrInpt.valueAsNumber).toBe(55.2);
		expect(nbrInpt.value).toBe('55.2');
		nbrInpt.value = '33';
		expect(nbrInpt.valueAsNumber).toBe(33);
		expect(nbrInpt.value).toBe('33');
	});

	it('Enforce a minimum numerical value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, minVal: 10 });
		nbrInpt.value = '-10';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '5';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '10';
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Enforce a maximum numerical value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, maxVal: 10 });
		nbrInpt.value = '15';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '10';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '-100';
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Enforce incremental steps to value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, incrementStep: 2 });
		nbrInpt.value = '3';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '2';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '-122';
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Handles input hinting properly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, incrementStep: 2, minVal: 5, maxVal: 20 });

		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field is required');
		expect(nbrInpt.hints).toContain('this field has to be between 5 and 20');
		nbrInpt.value = '3';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field has to be more than 5');
		expect(nbrInpt.hints).toContain('this field has to be in increments of 2');
		nbrInpt.value = '25';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field has to be less than 20');
		expect(nbrInpt.hints).toContain('this field has to be in increments of 2');
		nbrInpt.value = '10';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toStrictEqual([]);
	});
	it('Allows to translate hinting', () => {
		let myTranslation = {
			thisField: 'ce champ',
			isRequired: 'est requis',
			hasToBe: 'doit être',
			lessThan: 'moins de',
			moreThan: 'plus de',
			between: 'entre',
			and: 'et',
			inIncrementsOf: 'par incréments de',
		};
		let nbrInpt = new NumericalInput({
			...inputBase,
			required: true,
			incrementStep: 2,
			minVal: 5,
			maxVal: 20,
			hintConfig: { translation: myTranslation },
		});
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ est requis');
		expect(nbrInpt.hints).toContain('ce champ doit être entre 5 et 20');
		nbrInpt.value = '3';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ doit être plus de 5');
		expect(nbrInpt.hints).toContain('ce champ doit être par incréments de 2');
		nbrInpt.value = '25';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ doit être moins de 20');
		expect(nbrInpt.hints).toContain('ce champ doit être par incréments de 2');
		nbrInpt.value = '10';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toStrictEqual([]);
	});
	it('Allows toggling the hints', () => {
		let myHintToggle = { required: false };
		let nbrInpt = new NumericalInput({
			...inputBase,
			required: true,
			incrementStep: 2,
			minVal: 5,
			maxVal: 20,
			hintConfig: { toggle: myHintToggle },
		});
		nbrInpt.updateHint();
		expect(nbrInpt.hints).not.toContain('this field is required');
		nbrInpt.hintConfig.toggle.max = false;
		nbrInpt.hintConfig.toggle.required = true;
		nbrInpt.updateHint();
		expect(nbrInpt.hints).not.toContain('this field has to be between 5 and 20');
		expect(nbrInpt.hints).toContain('this field has to be more than 5');
		nbrInpt.hintConfig.toggle.min = false;
		nbrInpt.hintConfig.toggle.max = true;
		nbrInpt.updateHint();
		expect(nbrInpt.hints).not.toContain('this field has to be between 5 and 20');
		expect(nbrInpt.hints).toContain('this field has to be less than 20');
		nbrInpt.value = 3;
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field has to be in increments of 2');
		nbrInpt.hintConfig.toggle.increment = false;
		nbrInpt.updateHint();
		expect(nbrInpt.hints).not.toContain('this field has to be in increments of 2');
	});
});
import { ToggleInput } from '@src/ToggleInput';
describe('Toggle Input', () => {
	it('It toggles', () => {
		let tglInpt = new ToggleInput({ ...inputBase, initialState: true });
		expect(tglInpt.value).toBe(true);
		tglInpt.toggle();
		expect(tglInpt.value).toBe(false);
	});
	it('Requires validates value', () => {
		let tglInpt = new ToggleInput({ ...inputBase, initialState: true, required: true });
		expect(tglInpt.isValid).toBe(true);
		tglInpt.toggle();
		expect(tglInpt.isValid).toBe(false);
	});
});

import { InputOption } from '@src/InputOption';
import { OptionGroup } from '@src/OptionGroup';

describe('Input Option', () => {
	it('requires at least a value', () => {
		expect(() => {
			new InputOption({ label: 'option 1' });
		}).toThrow('A string value with a minimum length of 1 character must be provided for each options');
		expect(() => {
			new InputOption({ label: 'option 1', value: '1' });
		}).not.toThrow('A string value with a minimum length of 1 character must be provided for each options');
	});
	it("Can be disabled but isn't by default & disabled can be updated", () => {
		let option = new InputOption({ label: 'option 1', value: '1' });
		expect(option.disabled).toBe(false);
		option.disabled = true;
		expect(option.disabled).toBe(true);
		option = new InputOption({ value: '2', disabled: true });
		expect(option.disabled).toBe(true);
	});
	it("Can be pre-selected but isn't by default & pre-selection can be updated", () => {
		let option = new InputOption({ label: 'option 1', value: '1' });
		expect(option.preSelected).toBe(false);
		option.preSelected = true;
		expect(option.preSelected).toBe(true);
		option = new InputOption({ label: 'option 1', value: '1', preSelected: true });
		expect(option.preSelected).toBe(true);
	});
});

let opt1 = new InputOption({ label: 'first option', value: '1' });
let opt2 = new InputOption({ label: 'second option', value: '2' });
let optGroup1 = new OptionGroup({ label: 'first group', disabled: false, options: [opt1, opt2] });
let myOptionsArray: (InputOption | OptionGroup)[] = [opt1, opt2];

import { SingleOptionInput } from '@src/OptionInputs';
import { MultiOptionInput } from '@src/OptionInputs';
import { Input } from '@src/Input';
describe('Option Based Input', () => {
	let optionBasedInputs = [SingleOptionInput, MultiOptionInput];
	optionBasedInputs.forEach((OptionBasedInput) => {
		it('Requires options to initialize', () => {
			expect(() => {
				new OptionBasedInput({ ...inputBase });
			}).toThrow('Options are required for initialisation of option based input');
			expect(() => {
				new OptionBasedInput({ ...inputBase, options: [] });
			}).toThrow('Options are required for initialisation of option based input');
			expect(() => {
				new OptionBasedInput({ ...inputBase, options: myOptionsArray });
			}).not.toThrow('Options are required for initialisation of option based input');
		});

		it('Requires every options to have different values', () => {
			expect(() => {
				new OptionBasedInput({ ...inputBase, options: [opt1, opt1] });
			}).toThrow('All Options of option based Inputs must have unique values');
			expect(() => {
				new OptionBasedInput({ ...inputBase, options: myOptionsArray });
			}).not.toThrow('All Options of option based Inputs must have unique values');
		});
	});
});

describe('Single Option Input', () => {});
describe('Multi-Option Input', () => {});
