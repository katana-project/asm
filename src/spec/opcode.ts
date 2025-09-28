// This file was generated on 2025-09-28 19:07:18.231258. Do not edit, changes will be overwritten!

/** JVM opcodes. */
export enum Opcode {
	/**
	 * `aaload` instruction - Load reference from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type reference. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The reference value in the component of the array at index
	 * is retrieved and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	AALOAD = 0x32,

	/**
	 * `aastore` instruction - Store into reference array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type reference. The index must be of type
	 * int, and value must be of type reference. The arrayref, index,
	 * and value are popped from the operand stack.
	 * If value is null, then value is stored as the component of
	 * the array at index.
	 * Otherwise, value is non-null. If value is a value of the component
	 * type of the array referenced by arrayref, then value is stored as
	 * the component of the array at index.
	 * Whether value is a value of the array component type is determined
	 * according to the rules given for
	 * §checkcast.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	AASTORE = 0x53,

	/**
	 * `aconst_null` instruction - Push null.
	 *
	 * Push the null object reference onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., null`
	 */
	ACONST_NULL = 0x1,

	/**
	 * `aload` instruction - Load reference from local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at index must
	 * contain a reference. The objectref in the local variable at index
	 * is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., objectref`
	 */
	ALOAD = 0x19,

	/**
	 * `aload_<n>` instruction, variant `aload_0` - Load reference from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a reference. The objectref
	 * in the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., objectref`
	 */
	ALOAD_0 = 0x2a,

	/**
	 * `aload_<n>` instruction, variant `aload_1` - Load reference from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a reference. The objectref
	 * in the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., objectref`
	 */
	ALOAD_1 = 0x2b,

	/**
	 * `aload_<n>` instruction, variant `aload_2` - Load reference from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a reference. The objectref
	 * in the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., objectref`
	 */
	ALOAD_2 = 0x2c,

	/**
	 * `aload_<n>` instruction, variant `aload_3` - Load reference from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a reference. The objectref
	 * in the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., objectref`
	 */
	ALOAD_3 = 0x2d,

	/**
	 * `anewarray` instruction - Create new array of reference.
	 *
	 * The count must be of type int. It is popped off the operand
	 * stack. The count represents the number of components of the
	 * array to be created. The unsigned indexbyte1 and indexbyte2
	 * are used to construct an index into the run-time constant pool of
	 * the current class (§2.6), where the value of
	 * the index is (indexbyte1 << 8) | indexbyte2. The
	 * run-time constant pool entry at the index must be a symbolic
	 * reference to a class, array, or interface type. The named class,
	 * array, or interface type is resolved
	 * (§5.4.3.1). A new array with components of
	 * that type, of length count, is allocated from the
	 * garbage-collected heap, and a reference arrayref to this new array
	 * object is pushed onto the operand stack. All components of the new
	 * array are initialized to null, the default value for reference types
	 * (§2.4).
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., count → ..., arrayref`
	 */
	ANEWARRAY = 0xbd,

	/**
	 * `areturn` instruction - Return reference from method.
	 *
	 * The objectref must be of type reference and must refer to an object
	 * of a type that is assignment compatible (JLS §5.2) with the type
	 * represented by the return descriptor
	 * (§4.3.3) of the current method. If the
	 * current method is a synchronized method, the monitor entered or
	 * reentered on invocation of the method is updated and possibly
	 * exited as if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread. If
	 * no exception is thrown, objectref is popped from the operand
	 * stack of the current frame (§2.6) and pushed
	 * onto the operand stack of the frame of the invoker. Any other
	 * values on the operand stack of the current method are
	 * discarded.
	 * The interpreter then reinstates the frame of the invoker and
	 * returns control to the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → [empty]`
	 */
	ARETURN = 0xb0,

	/**
	 * `arraylength` instruction - Get length of array.
	 *
	 * The arrayref must be of type reference and must refer to an
	 * array. It is popped from the operand
	 * stack. The length of the array it references
	 * is determined. That length is pushed onto the
	 * operand stack as an int.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref → ..., length`
	 */
	ARRAYLENGTH = 0xbe,

	/**
	 * `astore` instruction - Store reference into local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The objectref on the top of the
	 * operand stack must be of type returnAddress or of type reference. It
	 * is popped from the operand stack, and the value of the local
	 * variable at index is set to objectref.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `..., objectref → ...`
	 */
	ASTORE = 0x3a,

	/**
	 * `astore_<n>` instruction, variant `astore_0` - Store reference into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The objectref
	 * on the top of the operand stack must be of type returnAddress or
	 * of type reference. It is popped from the operand stack, and the value
	 * of the local variable at <n> is set to
	 * objectref.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	ASTORE_0 = 0x4b,

	/**
	 * `astore_<n>` instruction, variant `astore_1` - Store reference into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The objectref
	 * on the top of the operand stack must be of type returnAddress or
	 * of type reference. It is popped from the operand stack, and the value
	 * of the local variable at <n> is set to
	 * objectref.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	ASTORE_1 = 0x4c,

	/**
	 * `astore_<n>` instruction, variant `astore_2` - Store reference into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The objectref
	 * on the top of the operand stack must be of type returnAddress or
	 * of type reference. It is popped from the operand stack, and the value
	 * of the local variable at <n> is set to
	 * objectref.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	ASTORE_2 = 0x4d,

	/**
	 * `astore_<n>` instruction, variant `astore_3` - Store reference into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The objectref
	 * on the top of the operand stack must be of type returnAddress or
	 * of type reference. It is popped from the operand stack, and the value
	 * of the local variable at <n> is set to
	 * objectref.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	ASTORE_3 = 0x4e,

	/**
	 * `athrow` instruction - Throw exception or error.
	 *
	 * The objectref must be of type reference and must refer to an object
	 * that is an instance of class Throwable or of a subclass of
	 * Throwable. It is popped from the operand stack. The objectref
	 * is then thrown by searching the current method
	 * (§2.6) for the first exception handler that
	 * matches the class of objectref, as given by the algorithm in
	 * §2.10.
	 * If an exception handler that matches objectref is found, it
	 * contains the location of the code intended to handle this
	 * exception. The pc register is reset to that location, the
	 * operand stack of the current frame is cleared, objectref is
	 * pushed back onto the operand stack, and execution
	 * continues.
	 * If no matching exception handler is found in the current frame,
	 * that frame is popped. If the current frame represents an
	 * invocation of a synchronized method, the monitor entered or
	 * reentered on invocation of the method is exited as if by execution
	 * of a monitorexit instruction
	 * (§monitorexit). Finally, the frame of
	 * its invoker is reinstated, if such a frame exists, and the
	 * objectref is rethrown. If no such frame exists, the current
	 * thread exits.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → objectref`
	 */
	ATHROW = 0xbf,

	/**
	 * `baload` instruction - Load byte or boolean from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type byte or of type boolean. The
	 * index must be of type int. Both arrayref and index are
	 * popped from the operand stack. The byte value in the component
	 * of the array at index is retrieved, sign-extended to an int
	 * value, and pushed onto the top of the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	BALOAD = 0x33,

	/**
	 * `bastore` instruction - Store into byte or boolean array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type byte or of type boolean. The
	 * index and the value must both be of type int. The arrayref,
	 * index, and value are popped from the operand stack.
	 * If the arrayref refers to an array whose components are of type byte,
	 * then the int value is truncated to a byte and stored as
	 * the component of the array indexed by index.
	 * If the arrayref refers to an array whose components are of type
	 * boolean, then the int value is narrowed by taking the bitwise
	 * AND of value and 1; the result is stored as the component of the
	 * array indexed by index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	BASTORE = 0x54,

	/**
	 * `bipush` instruction - Push byte.
	 *
	 * The immediate byte is sign-extended to an int value. That value is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `byte`
	 *
	 * Stack: `... → ..., value`
	 */
	BIPUSH = 0x10,

	/**
	 * `caload` instruction - Load char from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type char. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The component of the array at index is retrieved and
	 * zero-extended to an int value. That value is pushed onto the
	 * operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	CALOAD = 0x34,

	/**
	 * `castore` instruction - Store into char array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type char. The index and the value
	 * must both be of type int. The arrayref, index, and value
	 * are popped from the operand stack. The int value is truncated
	 * to a char and stored as the component of the array indexed by
	 * index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	CASTORE = 0x55,

	/**
	 * `checkcast` instruction - Check whether object is of given type.
	 *
	 * The objectref must be of type reference. The unsigned indexbyte1
	 * and indexbyte2 are used to construct an index into the run-time
	 * constant pool of the current class (§2.6),
	 * where the value of the index is (indexbyte1 << 8) |
	 * indexbyte2. The run-time constant pool entry at the index must be
	 * a symbolic reference to a class, array, or interface type.
	 * If objectref is null, then the operand stack is unchanged.
	 * Otherwise, the named class, array, or interface type is resolved
	 * (§5.4.3.1). If objectref is a value of the type
	 * given by the resolved class, array, or interface type, the operand stack is
	 * unchanged.
	 * The following rules are used to determine whether a non-null reference to
	 * an object is a value of a reference type, T.
	 * If the reference is to an instance of a class C, then:
	 * If T is the type of a class D, then the reference is
	 * a value of T if C is D or a subclass of D;
	 * If T is the type of an interface I, then the reference is
	 * a value of T if C implements I.
	 * If the reference is to an array with component type SC, then:
	 * If T is a class type, then the reference is a value of T
	 * if T is Object;
	 * If T is an interface type, then the reference is a value of T
	 * if T is Cloneable or java.io.Serializable, as defined by the
	 * bootstrap class loader (§5.3);
	 * If T is an array type TC[], that is, an array
	 * of components of type TC, then the reference is a value of T
	 * if one of the following is true:
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * If the reference is to an instance of a class C, then:
	 * If T is the type of a class D, then the reference is
	 * a value of T if C is D or a subclass of D;
	 * If T is the type of an interface I, then the reference is
	 * a value of T if C implements I.
	 * If the reference is to an array with component type SC, then:
	 * If T is a class type, then the reference is a value of T
	 * if T is Object;
	 * If T is an interface type, then the reference is a value of T
	 * if T is Cloneable or java.io.Serializable, as defined by the
	 * bootstrap class loader (§5.3);
	 * If T is an array type TC[], that is, an array
	 * of components of type TC, then the reference is a value of T
	 * if one of the following is true:
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * If the reference is to an instance of a class C, then:
	 * If T is the type of a class D, then the reference is
	 * a value of T if C is D or a subclass of D;
	 * If T is the type of an interface I, then the reference is
	 * a value of T if C implements I.
	 * If T is the type of a class D, then the reference is
	 * a value of T if C is D or a subclass of D;
	 * If T is the type of an interface I, then the reference is
	 * a value of T if C implements I.
	 * If T is the type of a class D, then the reference is
	 * a value of T if C is D or a subclass of D;
	 * If T is the type of an interface I, then the reference is
	 * a value of T if C implements I.
	 * If the reference is to an array with component type SC, then:
	 * If T is a class type, then the reference is a value of T
	 * if T is Object;
	 * If T is an interface type, then the reference is a value of T
	 * if T is Cloneable or java.io.Serializable, as defined by the
	 * bootstrap class loader (§5.3);
	 * If T is an array type TC[], that is, an array
	 * of components of type TC, then the reference is a value of T
	 * if one of the following is true:
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * If T is a class type, then the reference is a value of T
	 * if T is Object;
	 * If T is an interface type, then the reference is a value of T
	 * if T is Cloneable or java.io.Serializable, as defined by the
	 * bootstrap class loader (§5.3);
	 * If T is an array type TC[], that is, an array
	 * of components of type TC, then the reference is a value of T
	 * if one of the following is true:
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * If T is a class type, then the reference is a value of T
	 * if T is Object;
	 * If T is an interface type, then the reference is a value of T
	 * if T is Cloneable or java.io.Serializable, as defined by the
	 * bootstrap class loader (§5.3);
	 * If T is an array type TC[], that is, an array
	 * of components of type TC, then the reference is a value of T
	 * if one of the following is true:
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 * TC and SC are the same type;
	 * TC is the class type Object;
	 * TC is a class or interface type,
	 * SC is a class or interface type, and
	 * the class or interface named by SC extends or implements
	 * the class or interface named by TC;
	 * SC is an array type SCC[], and
	 * (applying these rules recursively) a reference to an array
	 * with component type SCC is a value of type TC.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref → ..., objectref`
	 */
	CHECKCAST = 0xc0,

	/**
	 * `d2f` instruction - Convert double to float.
	 *
	 * The value on the top of the operand stack must be of type
	 * double. It is popped from the operand stack and converted to a float result using
	 * the round to nearest rounding
	 * policy (§2.8). The result is pushed onto the
	 * operand stack.
	 * A finite value too small to be represented as a float is
	 * converted to a zero of the same sign; a finite value too large
	 * to be represented as a float is converted to an infinity of the
	 * same sign. A double NaN is converted to a float NaN.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	D2F = 0x90,

	/**
	 * `d2i` instruction - Convert double to int.
	 *
	 * The value on the top of the operand stack must be of type
	 * double. It is popped from the operand stack and converted to an int result.
	 * The result is pushed onto the operand stack:
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	D2I = 0x8e,

	/**
	 * `d2l` instruction - Convert double to long.
	 *
	 * The value on the top of the operand stack must be of type
	 * double. It is popped from the operand stack and converted to a long. The result is
	 * pushed onto the operand stack:
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the result
	 * is the smallest representable value of type long, or the
	 * value must be too large (a positive value of large magnitude
	 * or positive infinity), and the result is the largest
	 * representable value of type long.
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the result
	 * is the smallest representable value of type long, or the
	 * value must be too large (a positive value of large magnitude
	 * or positive infinity), and the result is the largest
	 * representable value of type long.
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the result
	 * is the smallest representable value of type long, or the
	 * value must be too large (a positive value of large magnitude
	 * or positive infinity), and the result is the largest
	 * representable value of type long.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	D2L = 0x8f,

	/**
	 * `dadd` instruction - Add double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack. The double result is value1 + value2. The
	 * result is pushed onto the operand stack.
	 * The result of a dadd instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of that sign.
	 * The sum of an infinity and any finite value is equal to the infinity.
	 * The sum of two zeroes of opposite sign is positive zero.
	 * The sum of two zeroes of the same sign is the zero of that sign.
	 * The sum of a zero and a nonzero finite value is equal to the nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large to
	 * represent as a double, we say the operation overflows; the result
	 * is then an infinity of appropriate sign. If the magnitude is too small
	 * to represent as a double, we say the operation underflows;
	 * the result is then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of that sign.
	 * The sum of an infinity and any finite value is equal to the infinity.
	 * The sum of two zeroes of opposite sign is positive zero.
	 * The sum of two zeroes of the same sign is the zero of that sign.
	 * The sum of a zero and a nonzero finite value is equal to the nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large to
	 * represent as a double, we say the operation overflows; the result
	 * is then an infinity of appropriate sign. If the magnitude is too small
	 * to represent as a double, we say the operation underflows;
	 * the result is then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of that sign.
	 * The sum of an infinity and any finite value is equal to the infinity.
	 * The sum of two zeroes of opposite sign is positive zero.
	 * The sum of two zeroes of the same sign is the zero of that sign.
	 * The sum of a zero and a nonzero finite value is equal to the nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large to
	 * represent as a double, we say the operation overflows; the result
	 * is then an infinity of appropriate sign. If the magnitude is too small
	 * to represent as a double, we say the operation underflows;
	 * the result is then a zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of a dadd instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DADD = 0x63,

	/**
	 * `daload` instruction - Load double from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type double. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The double value in the component of the array at index
	 * is retrieved and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	DALOAD = 0x31,

	/**
	 * `dastore` instruction - Store into double array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type double. The index must be of type
	 * int, and value must be of type double. The arrayref,
	 * index, and value are popped from the operand stack. The
	 * double value is
	 * stored as the component of the array indexed by index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	DASTORE = 0x52,

	/**
	 * `dcmp<op>` instruction, variant `dcmpg` - Compare double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack and a floating-point comparison is performed:
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * Floating-point comparison is performed in accordance with IEEE
	 * 754. All values other than NaN are ordered, with negative infinity
	 * less than all finite values and positive infinity greater than all
	 * finite values. Positive zero and negative zero are considered
	 * equal.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DCMPG = 0x98,

	/**
	 * `dcmp<op>` instruction, variant `dcmpl` - Compare double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack and a floating-point comparison is performed:
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * dcmpg instruction pushes the int value 1 onto the operand
	 * stack and the dcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * Floating-point comparison is performed in accordance with IEEE
	 * 754. All values other than NaN are ordered, with negative infinity
	 * less than all finite values and positive infinity greater than all
	 * finite values. Positive zero and negative zero are considered
	 * equal.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DCMPL = 0x97,

	/**
	 * `dconst_<d>` instruction, variant `dconst_0` - Push double.
	 *
	 * Push the double constant <d> (0.0 or 1.0) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <d>`
	 */
	DCONST_0 = 0xe,

	/**
	 * `dconst_<d>` instruction, variant `dconst_1` - Push double.
	 *
	 * Push the double constant <d> (0.0 or 1.0) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <d>`
	 */
	DCONST_1 = 0xf,

	/**
	 * `ddiv` instruction - Divide double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack. The double result is value1 / value2. The
	 * result is pushed onto the operand stack.
	 * The result of a ddiv instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest double using the
	 * round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a double, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest double using the
	 * round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a double, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest double using the
	 * round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a double, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, division by zero,
	 * or loss of precision may occur, execution of a ddiv instruction
	 * never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DDIV = 0x6f,

	/**
	 * `dload` instruction - Load double from local variable.
	 *
	 * The index is an unsigned byte. Both index and index+1 must
	 * be indices into the local variable array of the current frame
	 * (§2.6). The local variable at index must
	 * contain a double. The value of the local variable at index
	 * is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., value`
	 */
	DLOAD = 0x18,

	/**
	 * `dload_<n>` instruction, variant `dload_0` - Load double from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a double. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	DLOAD_0 = 0x26,

	/**
	 * `dload_<n>` instruction, variant `dload_1` - Load double from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a double. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	DLOAD_1 = 0x27,

	/**
	 * `dload_<n>` instruction, variant `dload_2` - Load double from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a double. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	DLOAD_2 = 0x28,

	/**
	 * `dload_<n>` instruction, variant `dload_3` - Load double from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a double. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	DLOAD_3 = 0x29,

	/**
	 * `dmul` instruction - Multiply double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack. The double result is value1 * value2. The
	 * result is pushed onto the operand stack.
	 * The result of a dmul instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using the
	 * round to nearest rounding policy (§2.8). If
	 * the magnitude is too large to represent as a double, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using the
	 * round to nearest rounding policy (§2.8). If
	 * the magnitude is too large to represent as a double, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using the
	 * round to nearest rounding policy (§2.8). If
	 * the magnitude is too large to represent as a double, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a double, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of a dmul instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DMUL = 0x6b,

	/**
	 * `dneg` instruction - Negate double.
	 *
	 * The value must be of type double. It is popped from the operand
	 * stack. The
	 * double result is the arithmetic negation of value. The
	 * result is pushed onto the operand stack.
	 * For double values, negation is not the same as subtraction from
	 * zero. If x is +0.0,
	 * then 0.0-x equals +0.0,
	 * but -x equals -0.0. Unary
	 * minus merely inverts the sign of a double.
	 * Special cases of interest:
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * The Java Virtual Machine has not adopted the stronger requirement from the
	 * 2019 version of the IEEE 754 Standard that negation inverts
	 * the sign bit for all inputs, including NaN.
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * The Java Virtual Machine has not adopted the stronger requirement from the
	 * 2019 version of the IEEE 754 Standard that negation inverts
	 * the sign bit for all inputs, including NaN.
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	DNEG = 0x77,

	/**
	 * `drem` instruction - Remainder double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack. The double result is calculated and pushed onto the
	 * operand stack.
	 * The result of a drem instruction is not the same as the result of
	 * the remainder operation defined by IEEE 754, due to the choice of
	 * rounding policy in the Java Virtual Machine (§2.8).
	 * The IEEE 754 remainder operation computes the remainder from a rounding
	 * division, not a truncating division, and so its behavior
	 * is not analogous to that of the usual integer
	 * remainder operator. Instead, the Java Virtual Machine defines drem to behave in
	 * a manner analogous to that of the integer remainder
	 * instructions irem and lrem, with an implied division using the
	 * round toward zero rounding policy; this may be compared with the C
	 * library function fmod.
	 * The result of a drem instruction is governed by the following
	 * rules, which match IEEE 754 arithmetic except for how the
	 * implied division is computed:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * Despite the fact that division by zero may occur, evaluation of a
	 * drem instruction never throws a run-time exception. Overflow,
	 * underflow, or loss of precision cannot occur.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DREM = 0x73,

	/**
	 * `dreturn` instruction - Return double from method.
	 *
	 * The current method must have return type double. The value
	 * must be of type double. If the current method is a
	 * synchronized method, the monitor entered or reentered on
	 * invocation of the method is updated and possibly exited as if by
	 * execution of a monitorexit instruction (§monitorexit) in the current thread. If no
	 * exception is thrown, value is popped from the operand stack of
	 * the current frame (§2.6) and pushed onto the operand stack of the
	 * frame of the invoker. Any other values on the operand stack of the
	 * current method are discarded.
	 * The interpreter then returns control to the invoker of the method,
	 * reinstating the frame of the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → [empty]`
	 */
	DRETURN = 0xaf,

	/**
	 * `dstore` instruction - Store double into local variable.
	 *
	 * The index is an unsigned byte. Both index and index+1 must
	 * be indices into the local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type double. It is popped from the
	 * operand stack.
	 * The local variables at index and index+1 are set to value.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `..., value → ...`
	 */
	DSTORE = 0x39,

	/**
	 * `dstore_<n>` instruction, variant `dstore_0` - Store double into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type double. It is popped from the
	 * operand stack.
	 * The local variables at <n> and <n>+1 are set to
	 * value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	DSTORE_0 = 0x47,

	/**
	 * `dstore_<n>` instruction, variant `dstore_1` - Store double into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type double. It is popped from the
	 * operand stack.
	 * The local variables at <n> and <n>+1 are set to
	 * value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	DSTORE_1 = 0x48,

	/**
	 * `dstore_<n>` instruction, variant `dstore_2` - Store double into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type double. It is popped from the
	 * operand stack.
	 * The local variables at <n> and <n>+1 are set to
	 * value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	DSTORE_2 = 0x49,

	/**
	 * `dstore_<n>` instruction, variant `dstore_3` - Store double into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type double. It is popped from the
	 * operand stack.
	 * The local variables at <n> and <n>+1 are set to
	 * value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	DSTORE_3 = 0x4a,

	/**
	 * `dsub` instruction - Subtract double.
	 *
	 * Both value1 and value2 must be of type double. The values
	 * are popped from the operand stack. The double result is value1 - value2. The
	 * result is pushed onto the operand stack.
	 * For double subtraction, it is always the case
	 * that a-b produces the same result
	 * as a+(-b). However, for the dsub instruction,
	 * subtraction from zero is not the same as negation, because
	 * if x is +0.0,
	 * then 0.0-x equals +0.0,
	 * but -x equals -0.0.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of a dsub instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	DSUB = 0x67,

	/**
	 * `dup` instruction - Duplicate the top operand stack value.
	 *
	 * Duplicate the top value on the operand stack and push the
	 * duplicated value onto the operand stack.
	 * The dup instruction must not be used unless value is a value
	 * of a category 1 computational type
	 * (§2.11.1).
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., value, value`
	 */
	DUP = 0x59,

	/**
	 * `dup_x1` instruction - Duplicate the top operand stack value and insert two values down.
	 *
	 * Duplicate the top value on the operand stack and insert the
	 * duplicated value two values down in the operand stack.
	 * The dup_x1 instruction must not be used unless both value1 and
	 * value2 are values of a category 1 computational type
	 * (§2.11.1).
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value2, value1 → ..., value1, value2, value1`
	 */
	DUP_X1 = 0x5a,

	/**
	 * `dup_x2` instruction - Duplicate the top operand stack value and insert two or three values down.
	 *
	 * Duplicate the top value on the operand stack and insert the
	 * duplicated value two or three values down in the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `Form 1: ..., value3, value2, value1 → ..., value1, value3, value2, value1 where value1, value2, and value3 are all values of a
	 * category 1 computational type
	 * (§2.11.1). Form 2: ..., value2, value1 → ..., value1, value2, value1 where value1 is a value of a category 1 computational type and
	 * value2 is a value of a category 2 computational type
	 * (§2.11.1).`
	 */
	DUP_X2 = 0x5b,

	/**
	 * `dup2` instruction - Duplicate the top one or two operand stack values.
	 *
	 * Duplicate the top one or two values on the operand stack and push
	 * the duplicated value or values back onto the operand stack in the
	 * original order.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `Form 1: ..., value2, value1 → ..., value2, value1, value2, value1 where both value1 and value2 are values of a category 1
	 * computational type (§2.11.1). Form 2: ..., value → ..., value, value where value is a value of a category 2 computational type
	 * (§2.11.1).`
	 */
	DUP2 = 0x5c,

	/**
	 * `dup2_x1` instruction - Duplicate the top one or two operand stack values and insert two or three values down.
	 *
	 * Duplicate the top one or two values on the operand stack and
	 * insert the duplicated values, in the original order, one value
	 * beneath the original value or values in the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `Form 1: ..., value3, value2, value1 → ..., value2, value1, value3, value2, value1 where value1, value2, and value3 are all values of a
	 * category 1 computational type
	 * (§2.11.1). Form 2: ..., value2, value1 → ..., value1, value2, value1 where value1 is a value of a category 2 computational type and
	 * value2 is a value of a category 1 computational type
	 * (§2.11.1).`
	 */
	DUP2_X1 = 0x5d,

	/**
	 * `dup2_x2` instruction - Duplicate the top one or two operand stack values and insert two, three, or four values down.
	 *
	 * Duplicate the top one or two values on the operand stack and
	 * insert the duplicated values, in the original order, into the
	 * operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `Form 1: ..., value4, value3, value2, value1 → ..., value2, value1, value4, value3, value2, value1 where value1, value2, value3, and value4 are all values of
	 * a category 1 computational type
	 * (§2.11.1). Form 2: ..., value3, value2, value1 → ..., value1, value3, value2, value1 where value1 is a value of a category 2 computational type and
	 * value2 and value3 are both values of a category 1
	 * computational type (§2.11.1). Form 3: ..., value3, value2, value1 → ..., value2, value1, value3, value2, value1 where value1 and value2 are both values of a category 1
	 * computational type and value3 is a value of a category 2
	 * computational type (§2.11.1). Form 4: ..., value2, value1 → ..., value1, value2, value1 where value1 and value2 are both values of a category 2
	 * computational type (§2.11.1).`
	 */
	DUP2_X2 = 0x5e,

	/**
	 * `f2d` instruction - Convert float to double.
	 *
	 * The value on the top of the operand stack must be of type
	 * float. It is popped from the operand stack and converted to a double result.
	 * The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	F2D = 0x8d,

	/**
	 * `f2i` instruction - Convert float to int.
	 *
	 * The value on the top of the operand stack must be of type
	 * float. It is popped from the operand stack and converted to an int result. The
	 * result is pushed onto the operand stack:
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 * If the value is NaN, the result of the conversion is an
	 * int 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as an int, then the result is the int value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type int, or
	 * the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type int.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	F2I = 0x8b,

	/**
	 * `f2l` instruction - Convert float to long.
	 *
	 * The value on the top of the operand stack must be of type
	 * float. It is popped from the operand stack and converted to a long result. The
	 * result is pushed onto the operand stack:
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type long,
	 * or the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type long.
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type long,
	 * or the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type long.
	 * If the value is NaN, the result of the conversion is a
	 * long 0.
	 * Otherwise, if the value is not an infinity, it is rounded
	 * to an integer value V using the round toward zero rounding
	 * policy (§2.8). If this integer value V can be
	 * represented as a long, then the result is the long value
	 * V.
	 * Otherwise, either the value must be too small (a negative
	 * value of large magnitude or negative infinity), and the
	 * result is the smallest representable value of type long,
	 * or the value must be too large (a positive value of large
	 * magnitude or positive infinity), and the result is the
	 * largest representable value of type long.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	F2L = 0x8c,

	/**
	 * `fadd` instruction - Add float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack. The float result is value1 + value2. The
	 * result is pushed onto the operand stack.
	 * The result of an fadd instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of
	 * that sign.
	 * The sum of an infinity and any finite value is equal to the
	 * infinity.
	 * The sum of two zeroes of opposite sign is positive
	 * zero.
	 * The sum of two zeroes of the same sign is the zero of that
	 * sign.
	 * The sum of a zero and a nonzero finite value is equal to the
	 * nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and
	 * opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large
	 * to represent as a float, we say the operation overflows;
	 * the result is then an infinity of appropriate sign.
	 * If the magnitude is too small to represent as a float,
	 * we say the operation underflows; the result is then a
	 * zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of
	 * that sign.
	 * The sum of an infinity and any finite value is equal to the
	 * infinity.
	 * The sum of two zeroes of opposite sign is positive
	 * zero.
	 * The sum of two zeroes of the same sign is the zero of that
	 * sign.
	 * The sum of a zero and a nonzero finite value is equal to the
	 * nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and
	 * opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large
	 * to represent as a float, we say the operation overflows;
	 * the result is then an infinity of appropriate sign.
	 * If the magnitude is too small to represent as a float,
	 * we say the operation underflows; the result is then a
	 * zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * The sum of two infinities of opposite sign is NaN.
	 * The sum of two infinities of the same sign is the infinity of
	 * that sign.
	 * The sum of an infinity and any finite value is equal to the
	 * infinity.
	 * The sum of two zeroes of opposite sign is positive
	 * zero.
	 * The sum of two zeroes of the same sign is the zero of that
	 * sign.
	 * The sum of a zero and a nonzero finite value is equal to the
	 * nonzero value.
	 * The sum of two nonzero finite values of the same magnitude and
	 * opposite sign is positive zero.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN and the values have the same sign or have
	 * different magnitudes, the sum is computed and rounded to the
	 * nearest representable value using the round to nearest rounding policy
	 * (§2.8). If the magnitude is too large
	 * to represent as a float, we say the operation overflows;
	 * the result is then an infinity of appropriate sign.
	 * If the magnitude is too small to represent as a float,
	 * we say the operation underflows; the result is then a
	 * zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of an fadd instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FADD = 0x62,

	/**
	 * `faload` instruction - Load float from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type float. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The float value in the component of the array at index
	 * is retrieved and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	FALOAD = 0x30,

	/**
	 * `fastore` instruction - Store into float array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type float. The index must be of type
	 * int, and the value must be of type float. The arrayref,
	 * index, and value are popped from the operand stack. The
	 * float value is
	 * stored as the component of the array indexed by index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	FASTORE = 0x51,

	/**
	 * `fcmp<op>` instruction, variant `fcmpg` - Compare float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack and a floating-point comparison is performed:
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * Floating-point comparison is performed in accordance with IEEE
	 * 754. All values other than NaN are ordered, with negative infinity
	 * less than all finite values and positive infinity greater than all
	 * finite values. Positive zero and negative zero are considered
	 * equal.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FCMPG = 0x96,

	/**
	 * `fcmp<op>` instruction, variant `fcmpl` - Compare float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack and a floating-point comparison is performed:
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * If value1 is greater than value2, the int value 1 is
	 * pushed onto the operand stack.
	 * Otherwise, if value1 is equal to value2, the int value
	 * 0 is pushed onto the operand stack.
	 * Otherwise, if value1 is less than value2, the int
	 * value -1 is pushed onto the operand stack.
	 * Otherwise, at least one of value1 or value2 is NaN. The
	 * fcmpg instruction pushes the int value 1 onto the operand
	 * stack and the fcmpl instruction pushes the int value -1
	 * onto the operand stack.
	 * Floating-point comparison is performed in accordance with IEEE
	 * 754. All values other than NaN are ordered, with negative infinity
	 * less than all finite values and positive infinity greater than all
	 * finite values. Positive zero and negative zero are considered
	 * equal.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FCMPL = 0x95,

	/**
	 * `fconst_<f>` instruction, variant `fconst_0` - Push float.
	 *
	 * Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <f>`
	 */
	FCONST_0 = 0xb,

	/**
	 * `fconst_<f>` instruction, variant `fconst_1` - Push float.
	 *
	 * Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <f>`
	 */
	FCONST_1 = 0xc,

	/**
	 * `fconst_<f>` instruction, variant `fconst_2` - Push float.
	 *
	 * Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <f>`
	 */
	FCONST_2 = 0xd,

	/**
	 * `fdiv` instruction - Divide float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack. The float result is value1 / value2. The
	 * result is pushed onto the operand stack.
	 * The result of an fdiv instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest float using the
	 * round to nearest rounding policy (§2.8). If the
	 * magnitude is too large to represent as a float, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest float using the
	 * round to nearest rounding policy (§2.8). If the
	 * magnitude is too large to represent as a float, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, negative
	 * if the values have different signs.
	 * Division of an infinity by an infinity results in NaN.
	 * Division of an infinity by a finite value results in a signed
	 * infinity, with the sign-producing rule just given.
	 * Division of a finite value by an infinity results in a signed
	 * zero, with the sign-producing rule just given.
	 * Division of a zero by a zero results in NaN; division of zero
	 * by any other finite value results in a signed zero, with the
	 * sign-producing rule just given.
	 * Division of a nonzero finite value by a zero results in a
	 * signed infinity, with the sign-producing rule just
	 * given.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the quotient is computed and rounded to the
	 * nearest float using the
	 * round to nearest rounding policy (§2.8). If the
	 * magnitude is too large to represent as a float, we say the
	 * operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, division by zero,
	 * or loss of precision may occur, execution of an fdiv instruction
	 * never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FDIV = 0x6e,

	/**
	 * `fload` instruction - Load float from local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at index must
	 * contain a float. The value of the local variable at index is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., value`
	 */
	FLOAD = 0x17,

	/**
	 * `fload_<n>` instruction, variant `fload_0` - Load float from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a float. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	FLOAD_0 = 0x22,

	/**
	 * `fload_<n>` instruction, variant `fload_1` - Load float from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a float. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	FLOAD_1 = 0x23,

	/**
	 * `fload_<n>` instruction, variant `fload_2` - Load float from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a float. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	FLOAD_2 = 0x24,

	/**
	 * `fload_<n>` instruction, variant `fload_3` - Load float from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain a float. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	FLOAD_3 = 0x25,

	/**
	 * `fmul` instruction - Multiply float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack. The float result is value1 * value2. The
	 * result is pushed onto the operand stack.
	 * The result of an fmul instruction is governed by the rules of
	 * IEEE 754 arithmetic:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using
	 * the round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a float, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using
	 * the round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a float, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result is positive if both values have the same sign, and
	 * negative if the values have different signs.
	 * Multiplication of an infinity by a zero results in NaN.
	 * Multiplication of an infinity by a finite value results in a
	 * signed infinity, with the sign-producing rule just given.
	 * In the remaining cases, where neither an infinity nor NaN is
	 * involved, the product is computed and rounded to the nearest
	 * representable value using
	 * the round to nearest rounding policy (§2.8).
	 * If the magnitude is too large to represent as a float, we say
	 * the operation overflows; the result is then an infinity of
	 * appropriate sign. If the magnitude is too small to represent
	 * as a float, we say the operation underflows; the result is
	 * then a zero of appropriate sign.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of an fmul instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FMUL = 0x6a,

	/**
	 * `fneg` instruction - Negate float.
	 *
	 * The value must be of type float. It is popped from the operand
	 * stack. The float
	 * result is the arithmetic negation of value. The result is
	 * pushed onto the operand stack.
	 * For float values, negation is not the same as subtraction from
	 * zero. If x is +0.0,
	 * then 0.0-x equals +0.0,
	 * but -x equals -0.0. Unary
	 * minus merely inverts the sign of a float.
	 * Special cases of interest:
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * The Java Virtual Machine has not adopted the stronger requirement from the
	 * 2019 version of the IEEE 754 Standard that negation inverts
	 * the sign bit for all inputs, including NaN.
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * The Java Virtual Machine has not adopted the stronger requirement from the
	 * 2019 version of the IEEE 754 Standard that negation inverts
	 * the sign bit for all inputs, including NaN.
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 * If the operand is NaN, the result is NaN (recall that NaN has
	 * no sign).
	 * If the operand is an infinity, the result is the infinity of
	 * opposite sign.
	 * If the operand is a zero, the result is the zero of opposite
	 * sign.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	FNEG = 0x76,

	/**
	 * `frem` instruction - Remainder float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack. The float result is calculated and pushed onto the
	 * operand stack.
	 * The result of an frem instruction is not the same as the result of
	 * the remainder operation defined by IEEE 754, due to the choice of
	 * rounding policy in the Java Virtual Machine (§2.8).
	 * The IEEE 754 remainder operation computes the remainder from a rounding
	 * division, not a truncating division, and so its behavior
	 * is not analogous to that of the usual integer
	 * remainder operator. Instead, the Java Virtual Machine defines frem to behave in
	 * a manner analogous to that of the integer remainder
	 * instructions irem and lrem, with an implied division using the
	 * round toward zero rounding policy; this may be compared with the C
	 * library function fmod.
	 * The result of an frem instruction is governed by the following
	 * rules, which match IEEE 754 arithmetic except for how the
	 * implied division is computed:
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * If either value1 or value2 is NaN, the result is NaN.
	 * If neither value1 nor value2 is NaN, the sign of the
	 * result equals the sign of the dividend.
	 * If the dividend is an infinity or the divisor is a zero or
	 * both, the result is NaN.
	 * If the dividend is finite and the divisor is an infinity, the
	 * result equals the dividend.
	 * If the dividend is a zero and the divisor is finite, the
	 * result equals the dividend.
	 * In the remaining cases, where neither operand is an infinity,
	 * a zero, or NaN, the floating-point remainder result from a
	 * dividend value1 and a divisor value2 is defined by the
	 * mathematical relation result = value1 - (value2 *
	 * q), where q is an integer that is negative only if
	 * value1 / value2 is negative, and positive only if
	 * value1 / value2 is positive, and whose magnitude is as
	 * large as possible without exceeding the magnitude of the true
	 * mathematical quotient of value1 and value2.
	 * Despite the fact that division by zero may occur, evaluation of an
	 * frem instruction never throws a run-time exception. Overflow,
	 * underflow, or loss of precision cannot occur.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FREM = 0x72,

	/**
	 * `freturn` instruction - Return float from method.
	 *
	 * The current method must have return type float. The value must
	 * be of type float. If the current method is a synchronized
	 * method, the monitor entered or reentered on invocation of the
	 * method is updated and possibly exited as if by execution of a
	 * monitorexit instruction (§monitorexit)
	 * in the current thread. If no exception is thrown, value is
	 * popped from the operand stack of the current frame (§2.6) and pushed onto the operand stack of the frame of the
	 * invoker. Any other values on the operand stack of the current
	 * method are discarded.
	 * The interpreter then returns control to the invoker of the method,
	 * reinstating the frame of the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → [empty]`
	 */
	FRETURN = 0xae,

	/**
	 * `fstore` instruction - Store float into local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame (§2.6). The value on the top of the operand stack
	 * must be of type float. It is popped from the operand stack, and
	 * the value of
	 * the local variable at index is set to value.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `..., value → ...`
	 */
	FSTORE = 0x38,

	/**
	 * `fstore_<n>` instruction, variant `fstore_0` - Store float into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type float. It is popped
	 * from the operand stack, and the value
	 * of the local variable at <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	FSTORE_0 = 0x43,

	/**
	 * `fstore_<n>` instruction, variant `fstore_1` - Store float into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type float. It is popped
	 * from the operand stack, and the value
	 * of the local variable at <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	FSTORE_1 = 0x44,

	/**
	 * `fstore_<n>` instruction, variant `fstore_2` - Store float into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type float. It is popped
	 * from the operand stack, and the value
	 * of the local variable at <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	FSTORE_2 = 0x45,

	/**
	 * `fstore_<n>` instruction, variant `fstore_3` - Store float into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type float. It is popped
	 * from the operand stack, and the value
	 * of the local variable at <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	FSTORE_3 = 0x46,

	/**
	 * `fsub` instruction - Subtract float.
	 *
	 * Both value1 and value2 must be of type float. The values are
	 * popped from the operand stack. The float result is value1 - value2. The
	 * result is pushed onto the operand stack.
	 * For float subtraction, it is always the case
	 * that a-b produces the same result
	 * as a+(-b). However, for the fsub instruction,
	 * subtraction from zero is not the same as negation, because
	 * if x is +0.0,
	 * then 0.0-x equals +0.0,
	 * but -x equals -0.0.
	 * The Java Virtual Machine requires support of gradual underflow.
	 * Despite the fact that overflow, underflow, or loss of
	 * precision may occur, execution of an fsub instruction never
	 * throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	FSUB = 0x66,

	/**
	 * `getfield` instruction - Fetch field from object.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a field
	 * (§5.1), which gives the name and descriptor
	 * of the field as well as a symbolic reference to the class in which
	 * the field is to be found. The referenced field is resolved
	 * (§5.4.3.2).
	 * The objectref, which must be of type reference but not an array type, is
	 * popped from the operand stack. The value of the referenced field in
	 * objectref is fetched and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref → ..., value`
	 */
	GETFIELD = 0xb4,

	/**
	 * `getstatic` instruction - Get static field from class.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a field
	 * (§5.1), which gives the name and descriptor
	 * of the field as well as a symbolic reference to the class or
	 * interface in which the field is to be found. The referenced field
	 * is resolved (§5.4.3.2).
	 * On successful resolution of the field, the class or interface that
	 * declared the resolved field is initialized if that class or
	 * interface has not already been initialized (§5.5).
	 * The value of the class or interface field is fetched and pushed
	 * onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., → ..., value`
	 */
	GETSTATIC = 0xb2,

	/**
	 * `goto` instruction - Branch always.
	 *
	 * The unsigned bytes branchbyte1 and branchbyte2 are used to
	 * construct a signed 16-bit branchoffset, where branchoffset is
	 * (branchbyte1 << 8) | branchbyte2. Execution proceeds at
	 * that offset from the address of the opcode of this goto
	 * instruction. The target address must be that of an opcode of an
	 * instruction within the method that contains this goto
	 * instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `No change`
	 */
	GOTO = 0xa7,

	/**
	 * `goto_w` instruction - Branch always (wide index).
	 *
	 * The unsigned bytes branchbyte1, branchbyte2, branchbyte3,
	 * and branchbyte4 are used to construct a signed 32-bit
	 * branchoffset, where branchoffset is (branchbyte1 <<
	 * 24) | (branchbyte2 << 16) | (branchbyte3 << 8) |
	 * branchbyte4. Execution proceeds at that offset from the address
	 * of the opcode of this goto_w instruction. The target address
	 * must be that of an opcode of an instruction within the method that
	 * contains this goto_w instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2, branchbyte3, branchbyte4`
	 *
	 * Stack: `No change`
	 */
	GOTO_W = 0xc8,

	/**
	 * `i2b` instruction - Convert int to byte.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack, truncated to a byte,
	 * then sign-extended to an int result. The result is pushed
	 * onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2B = 0x91,

	/**
	 * `i2c` instruction - Convert int to char.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack, truncated to char,
	 * then zero-extended to an int result. The result is pushed
	 * onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2C = 0x92,

	/**
	 * `i2d` instruction - Convert int to double.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack and converted to a
	 * double result. The result is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2D = 0x87,

	/**
	 * `i2f` instruction - Convert int to float.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack and converted to a
	 * float result using the
	 * round to nearest rounding policy (§2.8).
	 * The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2F = 0x86,

	/**
	 * `i2l` instruction - Convert int to long.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack and sign-extended to a
	 * long result. The result is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2L = 0x85,

	/**
	 * `i2s` instruction - Convert int to short.
	 *
	 * The value on the top of the operand stack must be of type
	 * int. It is popped from the operand stack, truncated to a
	 * short, then sign-extended to an int result. The result is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	I2S = 0x93,

	/**
	 * `iadd` instruction - Add int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. The int result is value1 +
	 * value2. The result is pushed onto the operand stack.
	 * The result is the 32 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type int. If overflow occurs, then the sign of the
	 * result may not be the same as the sign of the mathematical sum of
	 * the two values.
	 * Despite the fact that overflow may occur, execution of an iadd
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IADD = 0x60,

	/**
	 * `iaload` instruction - Load int from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type int. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The int value in the component of the array at index
	 * is retrieved and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	IALOAD = 0x2e,

	/**
	 * `iand` instruction - Bitwise AND int.
	 *
	 * Both value1 and value2 must be of type int. They are popped
	 * from the operand stack. An int result is calculated by taking
	 * the bitwise AND (conjunction) of value1 and value2. The
	 * result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IAND = 0x7e,

	/**
	 * `iastore` instruction - Store into int array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type int. Both index and value must
	 * be of type int. The arrayref, index, and value are popped
	 * from the operand stack. The int value is stored as the
	 * component of the array indexed by index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	IASTORE = 0x4f,

	/**
	 * `iconst_<i>` instruction, variant `iconst_m1` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_M1 = 0x2,

	/**
	 * `iconst_<i>` instruction, variant `iconst_0` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_0 = 0x3,

	/**
	 * `iconst_<i>` instruction, variant `iconst_1` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_1 = 0x4,

	/**
	 * `iconst_<i>` instruction, variant `iconst_2` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_2 = 0x5,

	/**
	 * `iconst_<i>` instruction, variant `iconst_3` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_3 = 0x6,

	/**
	 * `iconst_<i>` instruction, variant `iconst_4` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_4 = 0x7,

	/**
	 * `iconst_<i>` instruction, variant `iconst_5` - Push int constant.
	 *
	 * Push the int constant <i> (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <i>`
	 */
	ICONST_5 = 0x8,

	/**
	 * `idiv` instruction - Divide int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. The int result is the value of
	 * the Java programming language expression value1 / value2 (JLS §15.17.2).
	 * The result is pushed onto the operand stack.
	 * An int division rounds towards 0; that is, the quotient produced
	 * for int values in n/d is an int value q whose
	 * magnitude is as large as possible while satisfying |d ⋅
	 * q| ≤ |n|. Moreover, q is positive when |n|
	 * ≥ |d| and n and d have the same sign, but
	 * q is negative when |n| ≥ |d| and n and
	 * d have opposite signs.
	 * There is one special case that does not satisfy this rule: if the
	 * dividend is the negative integer of largest possible magnitude for
	 * the int type, and the divisor is -1, then overflow occurs, and
	 * the result is equal to the dividend. Despite the overflow, no
	 * exception is thrown in this case.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IDIV = 0x6c,

	/**
	 * `if_acmp<cond>` instruction, variant `if_acmpeq` - Branch if reference comparison succeeds.
	 *
	 * Both value1 and value2 must be of type reference. They are both
	 * popped from the operand stack and compared. The results of the
	 * comparison are as follows:
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_acmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_acmp<cond> instruction.
	 * Otherwise, if the comparison fails, execution proceeds at the
	 * address of the instruction following this if_acmp<cond>
	 * instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ACMPEQ = 0xa5,

	/**
	 * `if_acmp<cond>` instruction, variant `if_acmpne` - Branch if reference comparison succeeds.
	 *
	 * Both value1 and value2 must be of type reference. They are both
	 * popped from the operand stack and compared. The results of the
	 * comparison are as follows:
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * if_acmpeq succeeds if and only if value1 = value2
	 * if_acmpne succeeds if and only if value1 ≠ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_acmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_acmp<cond> instruction.
	 * Otherwise, if the comparison fails, execution proceeds at the
	 * address of the instruction following this if_acmp<cond>
	 * instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ACMPNE = 0xa6,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmpeq` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPEQ = 0x9f,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmpne` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPNE = 0xa0,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmplt` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPLT = 0xa1,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmpge` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPGE = 0xa2,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmpgt` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPGT = 0xa3,

	/**
	 * `if_icmp<cond>` instruction, variant `if_icmple` - Branch if int comparison succeeds.
	 *
	 * Both value1 and value2 must be of type int. They are both
	 * popped from the operand stack and compared. All comparisons are
	 * signed. The results of the comparison are as follows:
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * if_icmpeq succeeds if and only if value1 = value2
	 * if_icmpne succeeds if and only if value1 ≠ value2
	 * if_icmplt succeeds if and only if value1 < value2
	 * if_icmple succeeds if and only if value1 ≤ value2
	 * if_icmpgt succeeds if and only if value1 > value2
	 * if_icmpge succeeds if and only if value1 ≥ value2
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if_icmp<cond> instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this if_icmp<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if_icmp<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value1, value2 → ...`
	 */
	IF_ICMPLE = 0xa4,

	/**
	 * `if<cond>` instruction, variant `ifeq` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFEQ = 0x99,

	/**
	 * `if<cond>` instruction, variant `ifne` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFNE = 0x9a,

	/**
	 * `if<cond>` instruction, variant `iflt` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFLT = 0x9b,

	/**
	 * `if<cond>` instruction, variant `ifge` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFGE = 0x9c,

	/**
	 * `if<cond>` instruction, variant `ifgt` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFGT = 0x9d,

	/**
	 * `if<cond>` instruction, variant `ifle` - Branch if int comparison with zero succeeds.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack and compared against zero. All comparisons are signed. The
	 * results of the comparisons are as follows:
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * ifeq succeeds if and only if value = 0
	 * ifne succeeds if and only if value ≠ 0
	 * iflt succeeds if and only if value < 0
	 * ifle succeeds if and only if value ≤ 0
	 * ifgt succeeds if and only if value > 0
	 * ifge succeeds if and only if value ≥ 0
	 * If the comparison succeeds, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this if<cond> instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this if<cond> instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this if<cond> instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFLE = 0x9e,

	/**
	 * `ifnonnull` instruction - Branch if reference not null.
	 *
	 * The value must be of type reference. It is popped from the operand
	 * stack. If value is not null, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this ifnonnull instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this ifnonnull instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this ifnonnull instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFNONNULL = 0xc7,

	/**
	 * `ifnull` instruction - Branch if reference is null.
	 *
	 * The value must of type reference. It is popped from the operand
	 * stack. If value is null, the unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is calculated to be (branchbyte1 << 8) |
	 * branchbyte2. Execution then proceeds at that offset from the
	 * address of the opcode of this ifnull instruction. The target
	 * address must be that of an opcode of an instruction within the
	 * method that contains this ifnull instruction.
	 * Otherwise, execution proceeds at the address of the instruction
	 * following this ifnull instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	IFNULL = 0xc6,

	/**
	 * `iinc` instruction - Increment local variable by constant.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The const is an
	 * immediate signed byte. The local variable at index must contain
	 * an int. The value const is first
	 * sign-extended to an int, and then the local variable at index
	 * is incremented by that amount.
	 *
	 * Operands:
	 *  - `index, const`
	 *
	 * Stack: `No change`
	 */
	IINC = 0x84,

	/**
	 * `iload` instruction - Load int from local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at index must
	 * contain an int. The value of the local variable at index is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., value`
	 */
	ILOAD = 0x15,

	/**
	 * `iload_<n>` instruction, variant `iload_0` - Load int from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain an int. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	ILOAD_0 = 0x1a,

	/**
	 * `iload_<n>` instruction, variant `iload_1` - Load int from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain an int. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	ILOAD_1 = 0x1b,

	/**
	 * `iload_<n>` instruction, variant `iload_2` - Load int from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain an int. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	ILOAD_2 = 0x1c,

	/**
	 * `iload_<n>` instruction, variant `iload_3` - Load int from local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The local
	 * variable at <n> must contain an int. The value of
	 * the local variable at <n> is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	ILOAD_3 = 0x1d,

	/**
	 * `imul` instruction - Multiply int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. The int result is value1 *
	 * value2. The result is pushed onto the operand stack.
	 * The result is the 32 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type int. If overflow occurs, then the sign of the
	 * result may not be the same as the sign of the
	 * mathematical multiplication of the two values.
	 * Despite the fact that overflow may occur, execution of an imul
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IMUL = 0x68,

	/**
	 * `ineg` instruction - Negate int.
	 *
	 * The value must be of type int. It is popped from the operand
	 * stack. The int result is the arithmetic negation of value,
	 * -value. The result is pushed onto the operand stack.
	 * For int values, negation is the same as subtraction from
	 * zero. Because the Java Virtual Machine uses two's-complement representation for
	 * integers and the range of two's-complement values is not
	 * symmetric, the negation of the maximum negative int results in
	 * that same maximum negative number. Despite the fact that overflow
	 * has occurred, no exception is thrown.
	 * For all int values x, -x
	 * equals (~x)+1.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	INEG = 0x74,

	/**
	 * `instanceof` instruction - Determine if object is of given type.
	 *
	 * The objectref, which must be of type reference, is popped from the
	 * operand stack. The unsigned indexbyte1 and indexbyte2 are used
	 * to construct an index into the run-time constant pool of the
	 * current class (§2.6), where the value of the
	 * index is (indexbyte1 << 8) | indexbyte2. The run-time
	 * constant pool entry at the index must be a symbolic reference to a
	 * class, array, or interface type.
	 * If objectref is null, the instanceof instruction pushes an
	 * int result of 0 onto the operand stack.
	 * Otherwise, the named class, array, or interface type is resolved
	 * (§5.4.3.1). If objectref is a value of the type
	 * given by the resolved class, array, or interface type, the instanceof
	 * instruction pushes an int result of 1 onto the operand stack;
	 * otherwise, it pushes an int result of 0.
	 * Whether objectref is a value of the type given by the resolved class,
	 * array, or interface type is determined according to the rules given for
	 * §checkcast.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref → ..., result`
	 */
	INSTANCEOF = 0xc1,

	/**
	 * `invokedynamic` instruction - Invoke a dynamically-computed call site.
	 *
	 * First, the unsigned indexbyte1 and indexbyte2 are used to
	 * construct an index into the run-time constant pool of the current
	 * class (§2.6), where the value of the index
	 * is (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a
	 * dynamically-computed call site (§5.1). The
	 * values of the third and fourth operand bytes must always be
	 * zero.
	 * The symbolic reference is resolved (§5.4.3.6)
	 * for this specific invokedynamic
	 * instruction to obtain a reference to an instance
	 * of java.lang.invoke.CallSite. The instance of java.lang.invoke.CallSite is considered "bound"
	 * to this specific invokedynamic instruction.
	 * The instance of java.lang.invoke.CallSite indicates a target method
	 * handle. The nargs argument values are popped from the
	 * operand stack, and the target method handle is invoked. The
	 * invocation occurs as if by execution of an invokevirtual
	 * instruction that indicates a run-time constant pool index to a
	 * symbolic reference R where:
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invokeExact;
	 * for the descriptor of the method, R specifies the method
	 * descriptor in the dynamically-computed call site.
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invokeExact;
	 * for the descriptor of the method, R specifies the method
	 * descriptor in the dynamically-computed call site.
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invokeExact;
	 * for the descriptor of the method, R specifies the method
	 * descriptor in the dynamically-computed call site.
	 * and where it is as if the following items were pushed, in order,
	 * onto the operand stack:
	 * a reference to the target method handle;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the method descriptor in
	 * the dynamically-computed call site.
	 * a reference to the target method handle;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the method descriptor in
	 * the dynamically-computed call site.
	 * a reference to the target method handle;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the method descriptor in
	 * the dynamically-computed call site.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2, 0, 0`
	 *
	 * Stack: `..., [arg1, [arg2 ...]] → ...`
	 */
	INVOKEDYNAMIC = 0xba,

	/**
	 * `invokeinterface` instruction - Invoke interface method.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to an
	 * interface method (§5.1), which gives the
	 * name and descriptor (§4.3.3) of the
	 * interface method as well as a symbolic reference to the interface
	 * in which the interface method is to be found. The named interface
	 * method is resolved (§5.4.3.4).
	 * The resolved interface method must not be an instance
	 * initialization method, or the class or interface initialization
	 * method (§2.9.1,
	 * §2.9.2).
	 * The count operand is an unsigned byte that must not be zero. The
	 * objectref must be of type reference and must be followed on the
	 * operand stack by nargs argument values, where the number, type,
	 * and order of the values must be consistent with the descriptor of
	 * the resolved interface method. The value of the fourth operand
	 * byte must always be zero.
	 * Let C be the class of objectref. A method is selected with
	 * respect to C and the resolved method (§5.4.6).
	 * This is the method to be invoked.
	 * If the method to be invoked is synchronized, the monitor
	 * associated with objectref is entered or reentered as if by
	 * execution of a monitorenter instruction
	 * (§monitorenter) in the current
	 * thread.
	 * If the method to be invoked is not native, the nargs argument values and
	 * objectref are popped from the operand stack. A new frame is
	 * created on the Java Virtual Machine stack for the method being invoked. The
	 * objectref and the argument values are consecutively made the
	 * values of local variables of the new frame, with objectref in
	 * local variable 0, arg1 in local variable 1 (or, if arg1 is of
	 * type long or double, in local variables 1 and 2), and so
	 * on. The new frame is then made current,
	 * and the Java Virtual Machine pc is set to the opcode of the first instruction
	 * of the method to be invoked. Execution continues with the first
	 * instruction of the method.
	 * If the method to be invoked is native and the platform-dependent
	 * code that implements it has not yet been bound
	 * (§5.6) into the Java Virtual Machine, then that is
	 * done. The nargs argument values and objectref are popped from
	 * the operand stack and are passed as parameters to the code that
	 * implements the method. The parameters are passed and the code is invoked in an
	 * implementation-dependent manner. When the platform-dependent code
	 * returns:
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2, count, 0`
	 *
	 * Stack: `..., objectref, [arg1, [arg2 ...]] → ...`
	 */
	INVOKEINTERFACE = 0xb9,

	/**
	 * `invokespecial` instruction - Invoke instance method; direct invocation of instance initialization
	 * methods and methods of the current class and its supertypes.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a method
	 * or an interface method (§5.1), which gives
	 * the name and descriptor (§4.3.3) of the
	 * method or interface method as well as a symbolic reference to the
	 * class or interface in which the method or interface method is to
	 * be found. The named method is resolved
	 * (§5.4.3.3, §5.4.3.4).
	 * If all of the following are true, let C be the direct superclass
	 * of the current class:
	 * The resolved method is not an instance initialization method
	 * (§2.9.1).
	 * The symbolic reference names a class (not an interface),
	 * and that class is a superclass of the current class.
	 * The ACC_SUPER flag is set for the class file
	 * (§4.1).
	 * The resolved method is not an instance initialization method
	 * (§2.9.1).
	 * The symbolic reference names a class (not an interface),
	 * and that class is a superclass of the current class.
	 * The ACC_SUPER flag is set for the class file
	 * (§4.1).
	 * The resolved method is not an instance initialization method
	 * (§2.9.1).
	 * The symbolic reference names a class (not an interface),
	 * and that class is a superclass of the current class.
	 * The ACC_SUPER flag is set for the class file
	 * (§4.1).
	 * Otherwise, let C be the class or interface named by the
	 * symbolic reference.
	 * The actual method to be invoked is selected by the following
	 * lookup procedure:
	 * If C contains a declaration for an instance method with the
	 * same name and descriptor as the resolved method, then it is
	 * the method to be invoked.
	 * Otherwise, if C is a class and has a superclass, a search
	 * for a declaration of an instance method with the same name
	 * and descriptor as the resolved method is performed, starting
	 * with the direct superclass of C and continuing with the
	 * direct superclass of that class, and so forth, until a match
	 * is found or no further superclasses exist. If a match is
	 * found, then it is the method to be invoked.
	 * Otherwise, if C is an interface and the class Object
	 * contains a declaration of a public instance method with the
	 * same name and descriptor as the resolved method, then it is
	 * the method to be invoked.
	 * Otherwise, if there is exactly one maximally-specific method
	 * (§5.4.3.3) in the superinterfaces of C
	 * that matches the resolved method's name and descriptor and is
	 * not abstract, then it is the method to be invoked.
	 * The objectref must be of type reference and must be followed on the
	 * operand stack by nargs argument values, where the number, type,
	 * and order of the values must be consistent with the descriptor of
	 * the selected instance method.
	 * If the method is synchronized, the monitor associated with
	 * objectref is entered or reentered as if by execution of a
	 * monitorenter instruction
	 * (§monitorenter) in the current
	 * thread.
	 * If the method is not native, the nargs argument values and
	 * objectref are popped from the operand stack. A new frame is
	 * created on the Java Virtual Machine stack for the method being invoked. The
	 * objectref and the argument values are consecutively made the
	 * values of local variables of the new frame, with objectref in
	 * local variable 0, arg1 in local variable 1 (or, if arg1 is of
	 * type long or double, in local variables 1 and 2), and so
	 * on. The new frame is then made current,
	 * and the Java Virtual Machine pc is set to the opcode of the first instruction
	 * of the method to be invoked. Execution continues with the first
	 * instruction of the method.
	 * If the method is native and the platform-dependent code that
	 * implements it has not yet been bound (§5.6)
	 * into the Java Virtual Machine, that is done. The nargs argument values and
	 * objectref are popped from the operand stack and are passed as
	 * parameters to the code that implements the method. The parameters are passed and the code is invoked in
	 * an implementation-dependent manner. When the platform-dependent
	 * code returns, the following take place:
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current
	 * thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current
	 * thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current
	 * thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref, [arg1, [arg2 ...]] → ...`
	 */
	INVOKESPECIAL = 0xb7,

	/**
	 * `invokestatic` instruction - Invoke a class (static) method.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a method
	 * or an interface method (§5.1), which gives
	 * the name and descriptor (§4.3.3) of the
	 * method or interface method as well as a symbolic reference to the
	 * class or interface in which the method or interface method is to
	 * be found. The named method is resolved
	 * (§5.4.3.3, §5.4.3.4).
	 * The resolved method must not be an instance initialization method,
	 * or the class or interface initialization method
	 * (§2.9.1, §2.9.2).
	 * The resolved method must be static, and therefore cannot be
	 * abstract.
	 * On successful resolution of the method, the class or interface
	 * that declared the resolved method is initialized if that class or
	 * interface has not already been initialized
	 * (§5.5).
	 * The operand stack must contain nargs argument values, where the
	 * number, type, and order of the values must be consistent with the
	 * descriptor of the resolved method.
	 * If the method is synchronized, the monitor associated with the
	 * resolved Class object is entered or reentered as if by execution
	 * of a monitorenter instruction
	 * (§monitorenter) in the current
	 * thread.
	 * If the method is not native, the nargs argument values are
	 * popped from the operand stack. A new frame is created on the Java Virtual Machine
	 * stack for the method being invoked. The nargs argument values
	 * are consecutively made the values of local variables of the new
	 * frame, with arg1 in local variable 0 (or, if arg1 is of type
	 * long or double, in local variables 0 and 1) and so on. The new frame is then made current,
	 * and the Java Virtual Machine pc is set to the opcode of the first instruction
	 * of the method to be invoked. Execution continues with the first
	 * instruction of the method.
	 * If the method is native and the platform-dependent code that
	 * implements it has not yet been bound (§5.6)
	 * into the Java Virtual Machine, that is done. The nargs argument values are
	 * popped from the operand stack and are passed as parameters to the
	 * code that implements the method. The parameters are passed and the code is invoked in an
	 * implementation-dependent manner. When the platform-dependent code
	 * returns, the following take place:
	 * If the native method is synchronized, the monitor
	 * associated with the resolved Class object is updated and
	 * possibly exited as if by execution of a monitorexit
	 * instruction (§monitorexit) in the
	 * current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with the resolved Class object is updated and
	 * possibly exited as if by execution of a monitorexit
	 * instruction (§monitorexit) in the
	 * current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with the resolved Class object is updated and
	 * possibly exited as if by execution of a monitorexit
	 * instruction (§monitorexit) in the
	 * current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., [arg1, [arg2 ...]] → ...`
	 */
	INVOKESTATIC = 0xb8,

	/**
	 * `invokevirtual` instruction - Invoke instance method; dispatch based on class.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a method
	 * (§5.1), which gives the name and descriptor
	 * (§4.3.3) of the method as well as a symbolic
	 * reference to the class in which the method is to be found. The
	 * named method is resolved (§5.4.3.3).
	 * If the resolved method is not signature polymorphic
	 * (§2.9.3), then the invokevirtual instruction
	 * proceeds as follows.
	 * Let C be the class of objectref. A method is selected with
	 * respect to C and the resolved method (§5.4.6).
	 * This is the method to be invoked.
	 * The objectref must be followed on the operand stack by nargs
	 * argument values, where the number, type, and order of the values
	 * must be consistent with the descriptor of the selected instance
	 * method.
	 * If the method to be invoked is synchronized, the monitor
	 * associated with objectref is entered or reentered as if by
	 * execution of a monitorenter instruction
	 * (§monitorenter) in the current
	 * thread.
	 * If the method to be invoked is not native, the nargs argument
	 * values and objectref are popped from the operand stack. A new
	 * frame is created on the Java Virtual Machine stack for the method being
	 * invoked. The objectref and the argument values are consecutively
	 * made the values of local variables of the new frame, with
	 * objectref in local variable 0, arg1 in local variable 1 (or,
	 * if arg1 is of type long or double, in local variables 1 and
	 * 2), and so on. The new frame is
	 * then made current, and the Java Virtual Machine pc is set to the opcode of the
	 * first instruction of the method to be invoked. Execution continues
	 * with the first instruction of the method.
	 * If the method to be invoked is native and the platform-dependent
	 * code that implements it has not yet been bound (§5.6) into the Java Virtual Machine, that is done. The nargs
	 * argument values and objectref are popped from the operand stack
	 * and are passed as parameters to the code that implements the
	 * method. The parameters are
	 * passed and the code is invoked in an implementation-dependent
	 * manner. When the platform-dependent code returns, the following
	 * take place:
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the native method is synchronized, the monitor
	 * associated with objectref is updated and possibly exited as
	 * if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread.
	 * If the native method returns a value, the return value of
	 * the platform-dependent code is converted in an
	 * implementation-dependent way to the return type of the
	 * native method and pushed onto the operand stack.
	 * If the resolved method is signature polymorphic
	 * (§2.9.3),
	 * and declared in the java.lang.invoke.MethodHandle class,
	 * then the invokevirtual instruction proceeds as follows, where D is
	 * the descriptor of the method symbolically referenced by the instruction.
	 * First, a reference to an instance of java.lang.invoke.MethodType is obtained as if by
	 * resolution of a symbolic reference to a method type
	 * (§5.4.3.5) with the same parameter and
	 * return types as D.
	 * If the named method is invokeExact, the instance of
	 * java.lang.invoke.MethodType must be semantically equal to the type descriptor
	 * of the receiving method handle objectref. The
	 * method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is semantically equal to the type descriptor of
	 * the receiving method handle objectref, then
	 * the method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is not semantically equal to the type descriptor
	 * of the receiving method handle objectref, then the Java Virtual Machine
	 * attempts to adjust the type descriptor of the receiving method
	 * handle, as if by invocation of the asType method of java.lang.invoke.MethodHandle,
	 * to obtain an exactly invokable method handle m. The
	 * method handle to be invoked is m.
	 * If the named method is invokeExact, the instance of
	 * java.lang.invoke.MethodType must be semantically equal to the type descriptor
	 * of the receiving method handle objectref. The
	 * method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is semantically equal to the type descriptor of
	 * the receiving method handle objectref, then
	 * the method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is not semantically equal to the type descriptor
	 * of the receiving method handle objectref, then the Java Virtual Machine
	 * attempts to adjust the type descriptor of the receiving method
	 * handle, as if by invocation of the asType method of java.lang.invoke.MethodHandle,
	 * to obtain an exactly invokable method handle m. The
	 * method handle to be invoked is m.
	 * If the named method is invokeExact, the instance of
	 * java.lang.invoke.MethodType must be semantically equal to the type descriptor
	 * of the receiving method handle objectref. The
	 * method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is semantically equal to the type descriptor of
	 * the receiving method handle objectref, then
	 * the method handle to be invoked is objectref.
	 * If the named method is invoke, and the instance of
	 * java.lang.invoke.MethodType is not semantically equal to the type descriptor
	 * of the receiving method handle objectref, then the Java Virtual Machine
	 * attempts to adjust the type descriptor of the receiving method
	 * handle, as if by invocation of the asType method of java.lang.invoke.MethodHandle,
	 * to obtain an exactly invokable method handle m. The
	 * method handle to be invoked is m.
	 * The objectref must be followed on the operand stack by nargs
	 * argument values, where the number, type, and order of the values
	 * must be consistent with the type descriptor of the method handle
	 * to be invoked. (This type descriptor will correspond to the method
	 * descriptor appropriate for the kind of the method handle to be
	 * invoked, as specified in §5.4.3.5.)
	 * Then, if the method handle to be invoked has bytecode behavior,
	 * the Java Virtual Machine invokes the method handle as if by execution of the
	 * bytecode behavior associated with the method handle's kind. If the
	 * kind is 5 (REF_invokeVirtual), 6 (REF_invokeStatic), 7
	 * (REF_invokeSpecial), 8 (REF_newInvokeSpecial), or 9
	 * (REF_invokeInterface), then a frame will be created and made
	 * current in the course of executing the bytecode
	 * behavior; however, this frame is not visible, and when
	 * the method invoked by the bytecode behavior completes (normally or
	 * abruptly), the frame of its invoker is
	 * considered to be the frame for the method containing this
	 * invokevirtual instruction.
	 * Otherwise, if the method handle to be invoked has no bytecode
	 * behavior, the Java Virtual Machine invokes it in an implementation-dependent
	 * manner.
	 * If the resolved method is signature polymorphic and
	 * declared in the java.lang.invoke.VarHandle class, then the
	 * invokevirtual instruction proceeds as follows, where N and
	 * D are the name and descriptor of the method symbolically
	 * referenced by the instruction.
	 * First, a reference to an instance of java.lang.invoke.VarHandle.AccessMode is obtained
	 * as if by invocation of the valueFromMethodName method
	 * of java.lang.invoke.VarHandle.AccessMode with a String argument denoting N.
	 * Second, a reference to an instance of java.lang.invoke.MethodType is obtained as if
	 * by invocation of the accessModeType method of java.lang.invoke.VarHandle
	 * on the instance objectref, with the instance of
	 * java.lang.invoke.VarHandle.AccessMode as the argument.
	 * Third, a reference to an instance of java.lang.invoke.MethodHandle is obtained as if
	 * by invocation of the varHandleExactInvoker method of java.lang.invoke.MethodHandles
	 * with the instance of java.lang.invoke.VarHandle.AccessMode as the first argument
	 * and the instance of java.lang.invoke.MethodType as the second argument. The resulting
	 * instance is called the invoker method handle.
	 * Finally, the nargs argument values and objectref are popped
	 * from the operand stack, and the invoker method handle is
	 * invoked. The invocation occurs as if by execution of an
	 * invokevirtual instruction that indicates a run-time constant
	 * pool index to a symbolic reference R where:
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invoke;
	 * for the descriptor of the method, R specifies a return type
	 * indicated by the return descriptor of D, and specifies a
	 * first parameter type of java.lang.invoke.VarHandle followed by the parameter
	 * types indicated by the parameter descriptors of D (if any)
	 * in order.
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invoke;
	 * for the descriptor of the method, R specifies a return type
	 * indicated by the return descriptor of D, and specifies a
	 * first parameter type of java.lang.invoke.VarHandle followed by the parameter
	 * types indicated by the parameter descriptors of D (if any)
	 * in order.
	 * R is a symbolic reference to a method of a class;
	 * for the symbolic reference to the class in which the method is
	 * to be found, R specifies java.lang.invoke.MethodHandle;
	 * for the name of the method, R specifies invoke;
	 * for the descriptor of the method, R specifies a return type
	 * indicated by the return descriptor of D, and specifies a
	 * first parameter type of java.lang.invoke.VarHandle followed by the parameter
	 * types indicated by the parameter descriptors of D (if any)
	 * in order.
	 * and where it is as if the following items were pushed, in order,
	 * onto the operand stack:
	 * a reference to the instance of java.lang.invoke.MethodHandle (the invoker method handle);
	 * objectref;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the type descriptor of
	 * the invoker method handle.
	 * a reference to the instance of java.lang.invoke.MethodHandle (the invoker method handle);
	 * objectref;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the type descriptor of
	 * the invoker method handle.
	 * a reference to the instance of java.lang.invoke.MethodHandle (the invoker method handle);
	 * objectref;
	 * the nargs argument values, where the number, type, and order
	 * of the values must be consistent with the type descriptor of
	 * the invoker method handle.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref, [arg1, [arg2 ...]] → ...`
	 */
	INVOKEVIRTUAL = 0xb6,

	/**
	 * `ior` instruction - Bitwise OR int.
	 *
	 * Both value1 and value2 must be of type int. They are popped
	 * from the operand stack. An int result is calculated by taking
	 * the bitwise inclusive OR of value1 and value2. The result is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IOR = 0x80,

	/**
	 * `irem` instruction - Remainder int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. The int result is value1 -
	 * (value1 / value2) * value2. The result is pushed onto the
	 * operand stack.
	 * The result of the irem instruction is such that (a/b)*b
	 * + (a%b) is equal to a. This identity
	 * holds even in the special case in which the dividend is the
	 * negative int of largest possible magnitude for its type and the
	 * divisor is -1 (the remainder is 0). It follows from this rule that
	 * the result of the remainder operation can be negative only if the
	 * dividend is negative and can be positive only if the dividend is
	 * positive. Moreover, the magnitude of the result is always less
	 * than the magnitude of the divisor.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IREM = 0x70,

	/**
	 * `ireturn` instruction - Return int from method.
	 *
	 * The current method must have return type boolean, byte,
	 * char, short, or int. The value must be of type int. If
	 * the current method is a synchronized method, the monitor entered
	 * or reentered on invocation of the method is updated and possibly
	 * exited as if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread. If
	 * no exception is thrown, value is popped from the operand stack
	 * of the current frame (§2.6) and pushed onto
	 * the operand stack of the frame of the invoker. Any other values on
	 * the operand stack of the current method are discarded.
	 * Prior to pushing value onto the operand stack of the frame of
	 * the invoker, it may have to be converted. If the return type of
	 * the invoked method was byte, char, or short, then value is
	 * converted from int to the return type as if by execution of
	 * i2b, i2c, or i2s, respectively. If the return type of the
	 * invoked method was boolean, then value is narrowed from int to
	 * boolean by taking the bitwise AND of value and 1.
	 * The interpreter then returns control to the invoker of the method,
	 * reinstating the frame of the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → [empty]`
	 */
	IRETURN = 0xac,

	/**
	 * `ishl` instruction - Shift left int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. An int result is calculated by
	 * shifting value1 left by s bit positions, where s is
	 * the value of the low 5 bits of value2. The result is pushed
	 * onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	ISHL = 0x78,

	/**
	 * `ishr` instruction - Arithmetic shift right int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. An int result is calculated by
	 * shifting value1 right by s bit positions, with sign
	 * extension, where s is the value of the low 5 bits of
	 * value2. The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	ISHR = 0x7a,

	/**
	 * `istore` instruction - Store int into local variable.
	 *
	 * The index is an unsigned byte that must be an index into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type int. It is popped from the operand
	 * stack, and the value of the local variable at index is set to
	 * value.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `..., value → ...`
	 */
	ISTORE = 0x36,

	/**
	 * `istore_<n>` instruction, variant `istore_0` - Store int into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type int. It is popped
	 * from the operand stack, and the value of the local variable at
	 * <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	ISTORE_0 = 0x3b,

	/**
	 * `istore_<n>` instruction, variant `istore_1` - Store int into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type int. It is popped
	 * from the operand stack, and the value of the local variable at
	 * <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	ISTORE_1 = 0x3c,

	/**
	 * `istore_<n>` instruction, variant `istore_2` - Store int into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type int. It is popped
	 * from the operand stack, and the value of the local variable at
	 * <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	ISTORE_2 = 0x3d,

	/**
	 * `istore_<n>` instruction, variant `istore_3` - Store int into local variable.
	 *
	 * The <n> must be an index into the local variable array
	 * of the current frame (§2.6). The value on
	 * the top of the operand stack must be of type int. It is popped
	 * from the operand stack, and the value of the local variable at
	 * <n> is set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	ISTORE_3 = 0x3e,

	/**
	 * `isub` instruction - Subtract int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. The int result is value1 -
	 * value2. The result is pushed onto the operand stack.
	 * For int subtraction, a-b produces the same
	 * result as a+(-b). For int values, subtraction
	 * from zero is the same as negation.
	 * The result is the 32 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type int. If overflow occurs, then the sign of the
	 * result may not be the same as the sign of the mathematical
	 * difference of the two values.
	 * Despite the fact that overflow may occur, execution of an isub
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	ISUB = 0x64,

	/**
	 * `iushr` instruction - Logical shift right int.
	 *
	 * Both value1 and value2 must be of type int. The values are
	 * popped from the operand stack. An int result is calculated by
	 * shifting value1 right by s bit positions, with zero
	 * extension, where s is the value of the low 5 bits of
	 * value2. The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IUSHR = 0x7c,

	/**
	 * `ixor` instruction - Bitwise XOR int.
	 *
	 * Both value1 and value2 must be of type int. They are popped
	 * from the operand stack. An int result is calculated by taking
	 * the bitwise exclusive OR of value1 and value2. The result is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	IXOR = 0x82,

	/**
	 * `jsr` instruction - Jump subroutine.
	 *
	 * The address of the opcode of the instruction immediately
	 * following this jsr instruction is pushed onto the operand stack
	 * as a value of type returnAddress. The unsigned branchbyte1 and
	 * branchbyte2 are used to construct a signed 16-bit offset, where
	 * the offset is (branchbyte1 << 8) |
	 * branchbyte2. Execution proceeds at that offset from the address
	 * of this jsr instruction. The target address must be that of an
	 * opcode of an instruction within the method that contains this
	 * jsr instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2`
	 *
	 * Stack: `... → ..., address`
	 */
	JSR = 0xa8,

	/**
	 * `jsr_w` instruction - Jump subroutine (wide index).
	 *
	 * The address of the opcode of the instruction immediately
	 * following this jsr_w instruction is pushed onto the operand
	 * stack as a value of type returnAddress. The unsigned
	 * branchbyte1, branchbyte2, branchbyte3, and branchbyte4 are
	 * used to construct a signed 32-bit offset, where the offset is
	 * (branchbyte1 << 24) | (branchbyte2 << 16) |
	 * (branchbyte3 << 8) | branchbyte4. Execution proceeds at
	 * that offset from the address of this jsr_w instruction. The
	 * target address must be that of an opcode of an instruction within
	 * the method that contains this jsr_w instruction.
	 *
	 * Operands:
	 *  - `branchbyte1, branchbyte2, branchbyte3, branchbyte4`
	 *
	 * Stack: `... → ..., address`
	 */
	JSR_W = 0xc9,

	/**
	 * `l2d` instruction - Convert long to double.
	 *
	 * The value on the top of the operand stack must be of type
	 * long. It is popped from the operand stack and converted to a
	 * double result using the
	 * round to nearest rounding policy (§2.8).
	 * The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	L2D = 0x8a,

	/**
	 * `l2f` instruction - Convert long to float.
	 *
	 * The value on the top of the operand stack must be of type
	 * long. It is popped from the operand stack and converted to a
	 * float result using the
	 * round to nearest rounding policy (§2.8).
	 * The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	L2F = 0x89,

	/**
	 * `l2i` instruction - Convert long to int.
	 *
	 * The value on the top of the operand stack must be of type
	 * long. It is popped from the operand stack and converted to an
	 * int result by taking the low-order 32 bits of the long value
	 * and discarding the high-order 32 bits. The result is pushed onto
	 * the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	L2I = 0x88,

	/**
	 * `ladd` instruction - Add long.
	 *
	 * Both value1 and value2 must be of type long. The values are
	 * popped from the operand stack. The long result is value1 +
	 * value2. The result is pushed onto the operand stack.
	 * The result is the 64 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type long. If overflow occurs, the sign of the
	 * result may not be the same as the sign of the mathematical sum of
	 * the two values.
	 * Despite the fact that overflow may occur, execution of an ladd
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LADD = 0x61,

	/**
	 * `laload` instruction - Load long from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type long. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The long value in the component of the array at index
	 * is retrieved and pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	LALOAD = 0x2f,

	/**
	 * `land` instruction - Bitwise AND long.
	 *
	 * Both value1 and value2 must be of type long. They are popped
	 * from the operand stack. A long result is calculated by taking
	 * the bitwise AND of value1 and value2. The result is pushed
	 * onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LAND = 0x7f,

	/**
	 * `lastore` instruction - Store into long array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type long. The index must be of type
	 * int, and value must be of type long. The arrayref,
	 * index, and value are popped from the operand stack. The long
	 * value is stored as the component of the array indexed by
	 * index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	LASTORE = 0x50,

	/**
	 * `lcmp` instruction - Compare long.
	 *
	 * Both value1 and value2 must be of type long. They are both
	 * popped from the operand stack, and a signed integer comparison is
	 * performed. If value1 is greater than value2, the int value 1
	 * is pushed onto the operand stack. If value1 is equal to
	 * value2, the int value 0 is pushed onto the operand stack. If
	 * value1 is less than value2, the int value -1 is pushed onto
	 * the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LCMP = 0x94,

	/**
	 * `lconst_<l>` instruction, variant `lconst_0` - Push long constant.
	 *
	 * Push the long constant <l> (0 or 1) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <l>`
	 */
	LCONST_0 = 0x9,

	/**
	 * `lconst_<l>` instruction, variant `lconst_1` - Push long constant.
	 *
	 * Push the long constant <l> (0 or 1) onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., <l>`
	 */
	LCONST_1 = 0xa,

	/**
	 * `ldc` instruction - Push item from run-time constant pool.
	 *
	 * The index is an unsigned byte that must be a valid index into
	 * the run-time constant pool of the current class
	 * (§2.5.5). The run-time constant pool entry
	 * at index must be
	 * loadable (§5.1), and not any of the following:
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * If the run-time constant pool entry is a numeric constant of type
	 * int or float, then the value of that numeric constant is
	 * pushed onto the operand stack as an int or float, respectively.
	 * Otherwise, if the run-time constant pool entry is a string
	 * constant, that is, a reference to an instance of class String, then
	 * value, a reference to that instance, is pushed onto the operand stack.
	 * Otherwise, if the run-time constant pool entry is a symbolic
	 * reference to a class or interface, then the named class or
	 * interface is resolved (§5.4.3.1) and
	 * value, a reference to the Class object representing that class or
	 * interface, is pushed onto the operand stack.
	 * Otherwise, the run-time constant pool entry is a symbolic
	 * reference to a method type, a method handle, or a
	 * dynamically-computed constant. The symbolic reference is resolved
	 * (§5.4.3.5, §5.4.3.6)
	 * and value, the result of resolution, is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., value`
	 */
	LDC = 0x12,

	/**
	 * `ldc_w` instruction - Push item from run-time constant pool (wide index).
	 *
	 * The unsigned indexbyte1 and indexbyte2 are assembled into an
	 * unsigned 16-bit index into the run-time constant pool of the
	 * current class (§2.5.5), where the value of the
	 * index is calculated as (indexbyte1 << 8) | indexbyte2.
	 * The index must be a valid index into the run-time constant pool of
	 * the current class. The run-time constant pool entry at the
	 * index must be loadable
	 * (§5.1), and not any of the following:
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * If the run-time constant pool entry is a numeric constant of type
	 * int or float, or a string constant, then value is determined
	 * and pushed onto the operand stack according to the rules given for
	 * the ldc instruction.
	 * Otherwise, the run-time constant pool entry is a symbolic
	 * reference to a class, interface, method type, method handle, or
	 * dynamically-computed constant. It is resolved and value is
	 * determined and pushed onto the operand stack according to the
	 * rules given for the ldc instruction.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `... → ..., value`
	 */
	LDC_W = 0x13,

	/**
	 * `ldc2_w` instruction - Push long or double from run-time constant pool (wide index).
	 *
	 * The unsigned indexbyte1 and indexbyte2 are assembled into an
	 * unsigned 16-bit index into the run-time constant pool of the
	 * current class (§2.5.5), where the value of
	 * the index is calculated as (indexbyte1 << 8) |
	 * indexbyte2. The index must be a valid index into the run-time
	 * constant pool of the current class. The run-time constant pool
	 * entry at the index must be loadable (§5.1),
	 * and in particular one of the following:
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * A numeric constant of type long or double.
	 * A symbolic reference to a dynamically-computed constant whose
	 * field descriptor is J (denoting long) or
	 * D (denoting double).
	 * If the run-time constant pool entry is a numeric constant of type
	 * long or double, then the value of that numeric constant is
	 * pushed onto the operand stack as a long or double, respectively.
	 * Otherwise, the run-time constant pool entry is a symbolic
	 * reference to a dynamically-computed constant. The symbolic
	 * reference is resolved (§5.4.3.6) and
	 * value, the result of resolution, is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `... → ..., value`
	 */
	LDC2_W = 0x14,

	/**
	 * `ldiv` instruction - Divide long.
	 *
	 * Both value1 and value2 must be of type long. The values are
	 * popped from the operand stack. The long result is the value of
	 * the Java programming language expression value1 / value2. The result is
	 * pushed onto the operand stack.
	 * A long division rounds towards 0; that is, the quotient produced
	 * for long values in n / d is a long value q
	 * whose magnitude is as large as possible while satisfying |d
	 * ⋅ q| ≤ |n|. Moreover, q is positive when
	 * |n| ≥ |d| and n and d have the same sign,
	 * but q is negative when |n| ≥ |d| and n and
	 * d have opposite signs.
	 * There is one special case that does not satisfy this rule: if the
	 * dividend is the negative integer of largest possible magnitude for
	 * the long type and the divisor is -1, then overflow occurs and
	 * the result is equal to the dividend; despite the overflow, no
	 * exception is thrown in this case.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LDIV = 0x6d,

	/**
	 * `lload` instruction - Load long from local variable.
	 *
	 * The index is an unsigned byte. Both index and index+1 must
	 * be indices into the local variable array of the current frame
	 * (§2.6). The local variable at index must
	 * contain a long. The value of the local variable at index is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `... → ..., value`
	 */
	LLOAD = 0x16,

	/**
	 * `lload_<n>` instruction, variant `lload_0` - Load long from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a long. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	LLOAD_0 = 0x1e,

	/**
	 * `lload_<n>` instruction, variant `lload_1` - Load long from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a long. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	LLOAD_1 = 0x1f,

	/**
	 * `lload_<n>` instruction, variant `lload_2` - Load long from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a long. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	LLOAD_2 = 0x20,

	/**
	 * `lload_<n>` instruction, variant `lload_3` - Load long from local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The local variable at <n>
	 * must contain a long. The value of the local variable at
	 * <n> is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → ..., value`
	 */
	LLOAD_3 = 0x21,

	/**
	 * `lmul` instruction - Multiply long.
	 *
	 * Both value1 and value2 must be of type long. The values are
	 * popped from the operand stack. The long result is value1 *
	 * value2. The result is pushed onto the operand stack.
	 * The result is the 64 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type long. If overflow occurs, the sign of the
	 * result may not be the same as the sign of the
	 * mathematical multiplication of the two values.
	 * Despite the fact that overflow may occur, execution of an lmul
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LMUL = 0x69,

	/**
	 * `lneg` instruction - Negate long.
	 *
	 * The value must be of type long. It is popped from the operand
	 * stack. The long result is the arithmetic negation of value,
	 * -value. The result is pushed onto the operand stack.
	 * For long values, negation is the same as subtraction from
	 * zero. Because the Java Virtual Machine uses two's-complement representation for
	 * integers and the range of two's-complement values is not
	 * symmetric, the negation of the maximum negative long results in
	 * that same maximum negative number. Despite the fact that overflow
	 * has occurred, no exception is thrown.
	 * For all long values x, -x
	 * equals (~x)+1.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ..., result`
	 */
	LNEG = 0x75,

	/**
	 * `lookupswitch` instruction - Access jump table by key match and jump.
	 *
	 * A lookupswitch is a variable-length instruction. Immediately
	 * after the lookupswitch opcode, between zero and three bytes must
	 * act as padding, such that defaultbyte1 begins
	 * at an address that is a multiple of four bytes from the start of
	 * the current method (the opcode of its first
	 * instruction). Immediately after the padding follow a series of
	 * signed 32-bit
	 * values: default, npairs,
	 * and then npairs pairs of signed 32-bit
	 * values. The npairs must be greater than or
	 * equal to 0. Each of the npairs pairs consists
	 * of an int match and a signed
	 * 32-bit offset. Each of these signed 32-bit
	 * values is constructed from four unsigned bytes as
	 * (byte1 << 24) |
	 * (byte2 << 16) |
	 * (byte3 << 8)
	 * | byte4.
	 * The table match-offset pairs of the
	 * lookupswitch instruction must be sorted in increasing numerical
	 * order by match.
	 * The key must be of type int and is popped
	 * from the operand stack. The key is compared
	 * against the match values. If it is equal to
	 * one of them, then a target address is calculated by adding the
	 * corresponding offset to the address of the
	 * opcode of this lookupswitch instruction. If
	 * the key does not match any of
	 * the match values, the target address is
	 * calculated by adding default to the address
	 * of the opcode of this lookupswitch instruction. Execution then
	 * continues at the target address.
	 * The target address that can be calculated from the
	 * offset of
	 * each match-offset pair, as well as the one
	 * calculated from default, must be the address
	 * of an opcode of an instruction within the method that contains
	 * this lookupswitch instruction.
	 *
	 * Operands:
	 *  - `<0-3 byte pad>, defaultbyte1, defaultbyte2, defaultbyte3, defaultbyte4, npairs1, npairs2, npairs3, npairs4, match-offset pairs...`
	 *
	 * Stack: `..., key → ...`
	 */
	LOOKUPSWITCH = 0xab,

	/**
	 * `lor` instruction - Bitwise OR long.
	 *
	 * Both value1 and value2 must be of type long. They are popped
	 * from the operand stack. A long result is calculated by taking
	 * the bitwise inclusive OR of value1 and value2. The result is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LOR = 0x81,

	/**
	 * `lrem` instruction - Remainder long.
	 *
	 * Both value1 and value2 must be of type long. The values are
	 * popped from the operand stack. The long result is value1 -
	 * (value1 / value2) * value2. The result is pushed onto the
	 * operand stack.
	 * The result of the lrem instruction is such that
	 * (a/b)*b + (a%b) is equal
	 * to a. This identity holds even in the special
	 * case in which the dividend is the negative long of largest
	 * possible magnitude for its type and the divisor is -1 (the
	 * remainder is 0). It follows from this rule that the result of the
	 * remainder operation can be negative only if the dividend is
	 * negative and can be positive only if the dividend is positive;
	 * moreover, the magnitude of the result is always less than the
	 * magnitude of the divisor.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LREM = 0x71,

	/**
	 * `lreturn` instruction - Return long from method.
	 *
	 * The current method must have return type long. The value must
	 * be of type long. If the current method is a synchronized
	 * method, the monitor entered or reentered on invocation of the
	 * method is updated and possibly exited as if by execution of a
	 * monitorexit instruction (§monitorexit)
	 * in the current thread. If no exception is thrown, value is
	 * popped from the operand stack of the current frame
	 * (§2.6) and pushed onto the operand stack of
	 * the frame of the invoker. Any other values on the operand stack of
	 * the current method are discarded.
	 * The interpreter then returns control to the invoker of the method,
	 * reinstating the frame of the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → [empty]`
	 */
	LRETURN = 0xad,

	/**
	 * `lshl` instruction - Shift left long.
	 *
	 * The value1 must be of type long, and value2 must be of type
	 * int. The values are popped from the operand stack. A long
	 * result is calculated by shifting value1 left by s bit
	 * positions, where s is the low 6 bits of value2. The
	 * result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LSHL = 0x79,

	/**
	 * `lshr` instruction - Arithmetic shift right long.
	 *
	 * The value1 must be of type long, and value2 must be of type
	 * int. The values are popped from the operand stack. A long
	 * result is calculated by shifting value1 right by s bit
	 * positions, with sign extension, where s is the value of the
	 * low 6 bits of value2. The result is pushed onto the operand
	 * stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LSHR = 0x7b,

	/**
	 * `lstore` instruction - Store long into local variable.
	 *
	 * The index is an unsigned byte. Both index and index+1 must
	 * be indices into the local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type long. It is popped from the
	 * operand stack, and the local variables at index and index+1
	 * are set to value.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `..., value → ...`
	 */
	LSTORE = 0x37,

	/**
	 * `lstore_<n>` instruction, variant `lstore_0` - Store long into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type long. It is popped from the
	 * operand stack, and the local variables at <n> and
	 * <n>+1 are set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	LSTORE_0 = 0x3f,

	/**
	 * `lstore_<n>` instruction, variant `lstore_1` - Store long into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type long. It is popped from the
	 * operand stack, and the local variables at <n> and
	 * <n>+1 are set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	LSTORE_1 = 0x40,

	/**
	 * `lstore_<n>` instruction, variant `lstore_2` - Store long into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type long. It is popped from the
	 * operand stack, and the local variables at <n> and
	 * <n>+1 are set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	LSTORE_2 = 0x41,

	/**
	 * `lstore_<n>` instruction, variant `lstore_3` - Store long into local variable.
	 *
	 * Both <n> and <n>+1 must be indices into the
	 * local variable array of the current frame
	 * (§2.6). The value on the top of the
	 * operand stack must be of type long. It is popped from the
	 * operand stack, and the local variables at <n> and
	 * <n>+1 are set to value.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	LSTORE_3 = 0x42,

	/**
	 * `lsub` instruction - Subtract long.
	 *
	 * Both value1 and value2 must be of type long. The values are
	 * popped from the operand stack. The long result is value1 -
	 * value2. The result is pushed onto the operand stack.
	 * For long subtraction, a-b produces the same
	 * result as a+(-b). For long values,
	 * subtraction from zero is the same as negation.
	 * The result is the 64 low-order bits of the true mathematical
	 * result in a sufficiently wide two's-complement format, represented
	 * as a value of type long. If overflow occurs, then the sign of
	 * the result may not be the same as the sign of the
	 * mathematical difference of the two values.
	 * Despite the fact that overflow may occur, execution of an lsub
	 * instruction never throws a run-time exception.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LSUB = 0x65,

	/**
	 * `lushr` instruction - Logical shift right long.
	 *
	 * The value1 must be of type long, and value2 must be of type
	 * int. The values are popped from the operand stack. A long
	 * result is calculated by shifting value1 right
	 * logically by s bit positions, with zero
	 * extension, where s is the value of the low 6 bits of
	 * value2. The result is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LUSHR = 0x7d,

	/**
	 * `lxor` instruction - Bitwise XOR long.
	 *
	 * Both value1 and value2 must be of type long. They are popped
	 * from the operand stack. A long result is calculated by taking
	 * the bitwise exclusive OR of value1 and value2. The result is
	 * pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value1, value2 → ..., result`
	 */
	LXOR = 0x83,

	/**
	 * `monitorenter` instruction - Enter monitor for object.
	 *
	 * The objectref must be of type reference.
	 * Each object is associated with a monitor. A monitor is locked if
	 * and only if it has an owner. The thread that executes
	 * monitorenter attempts to gain ownership of the monitor
	 * associated with objectref, as follows:
	 * If the entry count of the monitor associated with objectref
	 * is zero, the thread enters the monitor and sets its entry
	 * count to one. The thread is then the owner of the
	 * monitor.
	 * If the thread already owns the monitor associated with
	 * objectref, it reenters the monitor, incrementing its entry
	 * count.
	 * If another thread already owns the monitor associated with
	 * objectref, the thread blocks until the monitor's entry count
	 * is zero, then tries again to gain ownership.
	 * If the entry count of the monitor associated with objectref
	 * is zero, the thread enters the monitor and sets its entry
	 * count to one. The thread is then the owner of the
	 * monitor.
	 * If the thread already owns the monitor associated with
	 * objectref, it reenters the monitor, incrementing its entry
	 * count.
	 * If another thread already owns the monitor associated with
	 * objectref, the thread blocks until the monitor's entry count
	 * is zero, then tries again to gain ownership.
	 * If the entry count of the monitor associated with objectref
	 * is zero, the thread enters the monitor and sets its entry
	 * count to one. The thread is then the owner of the
	 * monitor.
	 * If the thread already owns the monitor associated with
	 * objectref, it reenters the monitor, incrementing its entry
	 * count.
	 * If another thread already owns the monitor associated with
	 * objectref, the thread blocks until the monitor's entry count
	 * is zero, then tries again to gain ownership.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	MONITORENTER = 0xc2,

	/**
	 * `monitorexit` instruction - Exit monitor for object.
	 *
	 * The objectref must be of type reference.
	 * The thread that executes monitorexit must be the owner of the
	 * monitor associated with the instance referenced by
	 * objectref.
	 * The thread decrements the entry count of the monitor associated
	 * with objectref. If as a result the value of the entry count is
	 * zero, the thread exits the monitor and is no longer its
	 * owner. Other threads that are blocking to enter the monitor are
	 * allowed to attempt to do so.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., objectref → ...`
	 */
	MONITOREXIT = 0xc3,

	/**
	 * `multianewarray` instruction - Create new multidimensional array.
	 *
	 * The dimensions operand is an unsigned byte
	 * that must be greater than or equal to 1. It represents the number
	 * of dimensions of the array to be created. The operand stack must
	 * contain dimensions values. Each such value
	 * represents the number of components in a dimension of the array to
	 * be created, must be of type int, and must be
	 * non-negative. The count1 is the desired
	 * length in the first dimension, count2 in the
	 * second, etc.
	 * All of the count values are popped off the
	 * operand stack. The unsigned indexbyte1 and indexbyte2 are used
	 * to construct an index into the run-time constant pool of the
	 * current class (§2.6), where the value of the
	 * index is (indexbyte1 << 8) | indexbyte2. The run-time
	 * constant pool entry at the index must be a symbolic reference to a
	 * class, array, or interface type. The named class, array, or
	 * interface type is resolved (§5.4.3.1). The
	 * resulting entry must be an array class type of dimensionality
	 * greater than or equal to dimensions.
	 * A new multidimensional array of the array type is allocated from
	 * the garbage-collected heap. If any count
	 * value is zero, no subsequent dimensions are allocated. The
	 * components of the array in the first dimension are initialized to
	 * subarrays of the type of the second dimension, and so on. The
	 * components of the last allocated dimension of the array are
	 * initialized to the default initial value
	 * (§2.3, §2.4) for the
	 * element type of the array type. A reference arrayref to the new
	 * array is pushed onto the operand stack.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2, dimensions`
	 *
	 * Stack: `..., count1, [count2, ...] → ..., arrayref`
	 */
	MULTIANEWARRAY = 0xc5,

	/**
	 * `new` instruction - Create new object.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a class or
	 * interface type. The named class or interface type is resolved
	 * (§5.4.3.1) and should result in a class
	 * type. Memory for a new instance of that class is allocated from
	 * the garbage-collected heap, and the instance variables of the new
	 * object are initialized to their default initial values
	 * (§2.3, §2.4). The
	 * objectref, a reference to the instance, is pushed onto the operand
	 * stack.
	 * On successful resolution of the class, it is initialized if it has
	 * not already been initialized (§5.5).
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `... → ..., objectref`
	 */
	NEW = 0xbb,

	/**
	 * `newarray` instruction - Create new array.
	 *
	 * The count must be of type int. It is popped off the operand
	 * stack. The count represents the number of elements in the array
	 * to be created.
	 * The atype is a code that indicates the type
	 * of array to create. It must take one of the following
	 * values:
	 * A new array whose components are of
	 * type atype and of length count is allocated
	 * from the garbage-collected heap. A reference arrayref to this new
	 * array object is pushed into the operand stack. Each of the
	 * elements of the new array is initialized to the default initial
	 * value (§2.3, §2.4) for
	 * the element type of the array type.
	 *
	 * Operands:
	 *  - `atype`
	 *
	 * Stack: `..., count → ..., arrayref`
	 */
	NEWARRAY = 0xbc,

	/**
	 * `nop` instruction - Do nothing.
	 *
	 * Do nothing.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `No change`
	 */
	NOP = 0x0,

	/**
	 * `pop` instruction - Pop the top operand stack value.
	 *
	 * Pop the top value from the operand stack.
	 * The pop instruction must not be used unless value is a value
	 * of a category 1 computational type
	 * (§2.11.1).
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value → ...`
	 */
	POP = 0x57,

	/**
	 * `pop2` instruction - Pop the top one or two operand stack values.
	 *
	 * Pop the top one or two values from the operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `Form 1: ..., value2, value1 → ... where each of value1 and value2 is a value of a category 1
	 * computational type (§2.11.1). Form 2: ..., value → ... where value is a value of a category 2 computational type
	 * (§2.11.1).`
	 */
	POP2 = 0x58,

	/**
	 * `putfield` instruction - Set field in object.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a field
	 * (§5.1), which gives the name and descriptor
	 * of the field as well as a symbolic reference to the class in which
	 * the field is to be found. The referenced field is resolved
	 * (§5.4.3.2).
	 * The type of a value stored by a putfield instruction must be
	 * compatible with the descriptor of the referenced field (§4.3.2). If the field descriptor type is
	 * boolean, byte, char, short, or int, then the value
	 * must be an int. If the field descriptor type is float, long,
	 * or double, then the value must be a float, long, or
	 * double, respectively. If the field descriptor type is a class type or
	 * an array type, then the value must be a value of the field descriptor
	 * type. If the field is final, it must be declared in the current
	 * class, and the instruction must occur in an instance
	 * initialization method of the current class (§2.9.1).
	 * The value and objectref are popped from the operand stack.
	 * The objectref must be of type reference but not an array type.
	 * If the value is of type int and the field descriptor type is
	 * one of byte, char, short, or boolean, then the int value
	 * is converted to the field descriptor type as follows.
	 * If the field descriptor type is byte, char, or short, then the
	 * int value is truncated to a value of the field descriptor type,
	 * value'.
	 * If the field descriptor type is boolean, then the int value is
	 * narrowed by taking the bitwise AND of value and 1, resulting in
	 * value'.
	 * The referenced field in objectref is set to value'.
	 * Otherwise, the referenced field in objectref is set to value.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., objectref, value → ...`
	 */
	PUTFIELD = 0xb5,

	/**
	 * `putstatic` instruction - Set static field in class.
	 *
	 * The unsigned indexbyte1 and indexbyte2 are used to construct
	 * an index into the run-time constant pool of the current class
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The run-time constant
	 * pool entry at the index must be a symbolic reference to a field
	 * (§5.1), which gives the name and descriptor
	 * of the field as well as a symbolic reference to the class or
	 * interface in which the field is to be found. The referenced field
	 * is resolved (§5.4.3.2).
	 * On successful resolution of the field, the class or interface that
	 * declared the resolved field is initialized if that class or
	 * interface has not already been initialized (§5.5).
	 * The type of a value stored by a putstatic instruction must be
	 * compatible with the descriptor of the referenced field
	 * (§4.3.2). If the field descriptor type is
	 * boolean, byte, char, short, or int, then the value
	 * must be an int. If the field descriptor type is float, long,
	 * or double, then the value must be a float, long, or
	 * double, respectively. If the field descriptor type is a class type or
	 * an array type, then the value must be a value of the field descriptor
	 * type. If the field is final, it must be declared in the current
	 * class or interface, and the instruction must occur in the class or
	 * interface initialization method of the current class or interface
	 * (§2.9.2).
	 * The value is popped from the operand stack.
	 * If the value is of type int and the field descriptor type is
	 * one of byte, char, short, or boolean, then the int value
	 * is converted to the field descriptor type as follows.
	 * If the field descriptor type is byte, char, or short, then the
	 * int value is truncated to a value of the field descriptor type,
	 * value'.
	 * If the field descriptor type is boolean, then the int value is
	 * narrowed by taking the bitwise AND of value and 1, resulting in
	 * value'.
	 * The referenced field in the class or interface is set to value'.
	 * Otherwise, the referenced field in the class or interface is set to
	 * value.
	 *
	 * Operands:
	 *  - `indexbyte1, indexbyte2`
	 *
	 * Stack: `..., value → ...`
	 */
	PUTSTATIC = 0xb3,

	/**
	 * `ret` instruction - Return from subroutine.
	 *
	 * The index is an unsigned byte between 0 and 255, inclusive. The
	 * local variable at index in the current frame
	 * (§2.6) must contain a value of type
	 * returnAddress. The contents of the local variable are written
	 * into the Java Virtual Machine's pc register, and execution continues
	 * there.
	 *
	 * Operands:
	 *  - `index`
	 *
	 * Stack: `No change`
	 */
	RET = 0xa9,

	/**
	 * `return` instruction - Return void from method.
	 *
	 * The current method must have return type void. If the current
	 * method is a synchronized method, the monitor entered or
	 * reentered on invocation of the method is updated and possibly
	 * exited as if by execution of a monitorexit instruction
	 * (§monitorexit) in the current thread. If
	 * no exception is thrown, any values on the operand stack of the
	 * current frame (§2.6) are discarded.
	 * The interpreter then returns control to the invoker of the method,
	 * reinstating the frame of the invoker.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `... → [empty]`
	 */
	RETURN = 0xb1,

	/**
	 * `saload` instruction - Load short from array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type short. The index must be of type
	 * int. Both arrayref and index are popped from the operand
	 * stack. The component of the array at index is retrieved and
	 * sign-extended to an int value. That value is pushed onto the
	 * operand stack.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index → ..., value`
	 */
	SALOAD = 0x35,

	/**
	 * `sastore` instruction - Store into short array.
	 *
	 * The arrayref must be of type reference and must refer to an array
	 * whose components are of type short. Both index and value
	 * must be of type int. The arrayref, index, and value are
	 * popped from the operand stack. The int value is truncated to a
	 * short and stored as the component of the array indexed by
	 * index.
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., arrayref, index, value → ...`
	 */
	SASTORE = 0x56,

	/**
	 * `sipush` instruction - Push short.
	 *
	 * The immediate unsigned byte1
	 * and byte2 values are assembled into an
	 * intermediate short, where the value of the short is
	 * (byte1 << 8)
	 * | byte2. The intermediate value is then
	 * sign-extended to an int value. That value is pushed onto the
	 * operand stack.
	 *
	 * Operands:
	 *  - `byte1, byte2`
	 *
	 * Stack: `... → ..., value`
	 */
	SIPUSH = 0x11,

	/**
	 * `swap` instruction - Swap the top two operand stack values.
	 *
	 * Swap the top two values on the operand stack.
	 * The swap instruction must not be used unless value1 and
	 * value2 are both values of a category 1 computational type
	 * (§2.11.1).
	 *
	 * Operands:
	 *  - `[empty]`
	 *
	 * Stack: `..., value2, value1 → ..., value1, value2`
	 */
	SWAP = 0x5f,

	/**
	 * `tableswitch` instruction - Access jump table by index and jump.
	 *
	 * A tableswitch is a variable-length instruction. Immediately
	 * after the tableswitch opcode, between zero and three bytes must
	 * act as padding, such that defaultbyte1 begins
	 * at an address that is a multiple of four bytes from the start of
	 * the current method (the opcode of its first
	 * instruction). Immediately after the padding are bytes constituting
	 * three signed 32-bit values: default,
	 * low, and high.
	 * Immediately following are bytes constituting a series
	 * of high - low + 1 signed
	 * 32-bit offsets. The value low must be less
	 * than or equal to high.
	 * The high - low + 1
	 * signed 32-bit offsets are treated as a 0-based jump table. Each of
	 * these signed 32-bit values is constructed as
	 * (byte1 << 24) |
	 * (byte2 << 16) |
	 * (byte3 << 8)
	 * | byte4.
	 * The index must be of type int and is popped from the operand
	 * stack. If index is less than low or index
	 * is greater than high, then a target address
	 * is calculated by adding default to the
	 * address of the opcode of this tableswitch
	 * instruction. Otherwise, the offset at position
	 * index - low of the jump
	 * table is extracted. The target address is calculated by adding
	 * that offset to the address of the opcode of this tableswitch
	 * instruction. Execution then continues at the target
	 * address.
	 * The target address that can be calculated from each jump table
	 * offset, as well as the one that can be calculated
	 * from default, must be the address of an
	 * opcode of an instruction within the method that contains this
	 * tableswitch instruction.
	 *
	 * Operands:
	 *  - `<0-3 byte pad>, defaultbyte1, defaultbyte2, defaultbyte3, defaultbyte4, lowbyte1, lowbyte2, lowbyte3, lowbyte4, highbyte1, highbyte2, highbyte3, highbyte4, jump offsets...`
	 *
	 * Stack: `..., index → ...`
	 */
	TABLESWITCH = 0xaa,

	/**
	 * `wide` instruction - Extend local variable index by additional bytes.
	 *
	 * The wide instruction modifies the behavior of another
	 * instruction. It takes one of two formats, depending on the
	 * instruction being modified. The first form of the wide
	 * instruction modifies one of the instructions iload, fload,
	 * aload, lload, dload, istore, fstore, astore, lstore,
	 * dstore, or ret (§iload,
	 * §fload,
	 * §aload,
	 * §lload,
	 * §dload,
	 * §istore,
	 * §fstore,
	 * §astore,
	 * §lstore,
	 * §dstore,
	 * §ret). The second form applies only to
	 * the iinc instruction (§iinc).
	 * In either case, the wide opcode itself is followed in the
	 * compiled code by the opcode of the instruction wide modifies. In
	 * either form, two unsigned bytes indexbyte1 and indexbyte2
	 * follow the modified opcode and are assembled into a 16-bit
	 * unsigned index to a local variable in the current frame
	 * (§2.6), where the value of the index is
	 * (indexbyte1 << 8) | indexbyte2. The calculated index
	 * must be an index into the local variable array of the current
	 * frame. Where the wide instruction modifies an lload, dload,
	 * lstore, or dstore instruction, the index following the
	 * calculated index (index + 1) must also be an index into the local
	 * variable array. In the second form, two immediate unsigned bytes
	 * constbyte1
	 * and constbyte2 follow indexbyte1 and
	 * indexbyte2 in the code stream. Those bytes are also assembled
	 * into a signed 16-bit constant, where the constant is
	 * (constbyte1 << 8)
	 * | constbyte2.
	 * The widened bytecode operates as normal, except for the use of the
	 * wider index and, in the case of the second form, the larger
	 * increment range.
	 *
	 * Operands:
	 *  - `<opcode>, indexbyte1, indexbyte2`
	 *  - `iinc, indexbyte1, indexbyte2, constbyte1, constbyte2`
	 *
	 * Stack: `Same as modified instruction`
	 */
	WIDE = 0xc4,
}
