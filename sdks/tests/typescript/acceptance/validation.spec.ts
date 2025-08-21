import { ObjectSerializer, SignalBroadcastRequest } from '../../../generated/typescript'

describe('ObjectSerializer primitive validation', () => {
	const ORIGINAL_ENV = process.env.CAMUNDA_SDK_VALIDATION;
	const restoreEnv = () => {
		if (ORIGINAL_ENV === undefined) delete process.env.CAMUNDA_SDK_VALIDATION;
		else process.env.CAMUNDA_SDK_VALIDATION = ORIGINAL_ENV;
	};

	afterEach(() => {
		jest.restoreAllMocks();
		restoreEnv();
	});

	test('strict: serialize throws when string expected but number given', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'strict';

		const bad: Partial<SignalBroadcastRequest> = { signalName: 123 as unknown as string };
		expect(() => ObjectSerializer.serialize(bad, 'SignalBroadcastRequest')).toThrow(
				/Validation failed \(serialize\)/
			);
	});

	test('warn: serialize warns and passes through', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'warn';
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const bad: Partial<SignalBroadcastRequest> = { signalName: 123 as unknown as string };
		const result = ObjectSerializer.serialize(bad, 'SignalBroadcastRequest') as any;

		expect(warnSpy).toHaveBeenCalled();
		// In warn mode, value passes through unchanged
		expect(result.signalName).toBe(123);
	});

	test('none: serialize does not validate', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'none';
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const bad: Partial<SignalBroadcastRequest> = { signalName: 123 as unknown as string };
		const result = ObjectSerializer.serialize(bad, 'SignalBroadcastRequest') as any;

		expect(warnSpy).not.toHaveBeenCalled();
		expect(result.signalName).toBe(123);
	});

	test('strict: deserialize throws when string expected but number given', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'strict';
		expect(() => ObjectSerializer.deserialize(123, 'string')).toThrow(
				/Validation failed \(deserialize\)/
			);
	});

	test('warn: deserialize warns and passes through', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'warn';
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const value = ObjectSerializer.deserialize(123, 'string');
		expect(warnSpy).toHaveBeenCalled();
		expect(value).toBe(123);
	});

	test('none: deserialize does not validate', () => {
		process.env.CAMUNDA_SDK_VALIDATION = 'none';
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const value = ObjectSerializer.deserialize(123, 'string');
		expect(warnSpy).not.toHaveBeenCalled();
		expect(value).toBe(123);
	});
});

