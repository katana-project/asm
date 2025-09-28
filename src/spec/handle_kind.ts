// This file was generated on 2025-09-28 19:07:18.231258. Do not edit, changes will be overwritten!

/** Constant pool method handle kinds. */
export enum HandleKind {
	/**
	 * `REF_getField` handle kind.
	 *
	 * Interpreted as: `getfield C.f:T`
	 */
	GET_FIELD = 1,

	/**
	 * `REF_getStatic` handle kind.
	 *
	 * Interpreted as: `getstatic C.f:T`
	 */
	GET_STATIC = 2,

	/**
	 * `REF_putField` handle kind.
	 *
	 * Interpreted as: `putfield C.f:T`
	 */
	PUT_FIELD = 3,

	/**
	 * `REF_putStatic` handle kind.
	 *
	 * Interpreted as: `putstatic C.f:T`
	 */
	PUT_STATIC = 4,

	/**
	 * `REF_invokeVirtual` handle kind.
	 *
	 * Interpreted as: `invokevirtual C.m:(A*)T`
	 */
	INVOKE_VIRTUAL = 5,

	/**
	 * `REF_invokeStatic` handle kind.
	 *
	 * Interpreted as: `invokestatic C.m:(A*)T`
	 */
	INVOKE_STATIC = 6,

	/**
	 * `REF_invokeSpecial` handle kind.
	 *
	 * Interpreted as: `invokespecial C.m:(A*)T`
	 */
	INVOKE_SPECIAL = 7,

	/**
	 * `REF_newInvokeSpecial` handle kind.
	 *
	 * Interpreted as: `new C; dup; invokespecial C.<init>:(A*)V`
	 */
	NEW_INVOKE_SPECIAL = 8,

	/**
	 * `REF_invokeInterface` handle kind.
	 *
	 * Interpreted as: `invokeinterface C.m:(A*)T`
	 */
	INVOKE_INTERFACE = 9,
}
