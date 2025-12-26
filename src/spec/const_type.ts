/** ClassFile constant pool tags. */
export enum ConstantType {
	/**
	 * `CONSTANT_Utf8` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	UTF8 = 1,

	/**
	 * `CONSTANT_Integer` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	INTEGER = 3,

	/**
	 * `CONSTANT_Float` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	FLOAT = 4,

	/**
	 * `CONSTANT_Long` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	LONG = 5,

	/**
	 * `CONSTANT_Double` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	DOUBLE = 6,

	/**
	 * `CONSTANT_Class` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	CLASS = 7,

	/**
	 * `CONSTANT_String` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	STRING = 8,

	/**
	 * `CONSTANT_Fieldref` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	FIELDREF = 9,

	/**
	 * `CONSTANT_Methodref` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	METHODREF = 10,

	/**
	 * `CONSTANT_InterfaceMethodref` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	INTERFACE_METHODREF = 11,

	/**
	 * `CONSTANT_NameAndType` tag.
	 *
	 * Since: 45.3 (Java 1.0.2)
	 */
	NAME_AND_TYPE = 12,

	/**
	 * `CONSTANT_MethodHandle` tag.
	 *
	 * Since: 51.0 (Java 7)
	 */
	METHOD_HANDLE = 15,

	/**
	 * `CONSTANT_MethodType` tag.
	 *
	 * Since: 51.0 (Java 7)
	 */
	METHOD_TYPE = 16,

	/**
	 * `CONSTANT_Dynamic` tag.
	 *
	 * Since: 55.0 (Java 11)
	 */
	DYNAMIC = 17,

	/**
	 * `CONSTANT_InvokeDynamic` tag.
	 *
	 * Since: 51.0 (Java 7)
	 */
	INVOKE_DYNAMIC = 18,

	/**
	 * `CONSTANT_Module` tag.
	 *
	 * Since: 53.0 (Java 9)
	 */
	MODULE = 19,

	/**
	 * `CONSTANT_Package` tag.
	 *
	 * Since: 53.0 (Java 9)
	 */
	PACKAGE = 20,
}
