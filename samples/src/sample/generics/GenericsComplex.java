package sample.generics;

import java.io.Serializable;

public class GenericsComplex {
    public static <T extends Number & Comparable<T>> T add(T a, T b) {
        if (a instanceof Integer) {
            return (T) Integer.valueOf(a.intValue() + b.intValue());
        } else if (a instanceof Double) {
            return (T) Double.valueOf(a.doubleValue() + b.doubleValue());
        } else if (a instanceof Long) {
            return (T) Long.valueOf(a.longValue() + b.longValue());
        } else if (a instanceof Float) {
            return (T) Float.valueOf(a.floatValue() + b.floatValue());
        } else if (a instanceof Short) {
            return (T) Short.valueOf((short) (a.shortValue() + b.shortValue()));
        } else if (a instanceof Byte) {
            return (T) Byte.valueOf((byte) (a.byteValue() + b.byteValue()));
        } else {
            throw new UnsupportedOperationException("Type not supported");
        }
    }

    public static <T extends Runnable & Serializable> void runSerializable(T r) {
        r.run();
    }
}
