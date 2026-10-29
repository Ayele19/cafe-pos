package com.example.cafe_pos.security;

/**
 * Fine-grained authorities attached to the JWT principal.
 * Spring {@code hasAuthority('PERM_...')} checks these strings.
 */
public final class Permission {

    public static final String PREFIX = "PERM_";

    public static final String MENU_READ = PREFIX + "MENU_READ";
    public static final String MENU_WRITE = PREFIX + "MENU_WRITE";

    public static final String ORDER_READ = PREFIX + "ORDER_READ";
    public static final String ORDER_CREATE = PREFIX + "ORDER_CREATE";

    public static final String CUSTOMER_READ = PREFIX + "CUSTOMER_READ";
    public static final String CUSTOMER_WRITE = PREFIX + "CUSTOMER_WRITE";
    public static final String CUSTOMER_DELETE = PREFIX + "CUSTOMER_DELETE";

    public static final String SELLER_READ = PREFIX + "SELLER_READ";
    public static final String SELLER_WRITE = PREFIX + "SELLER_WRITE";

    public static final String SYSTEM_READ = PREFIX + "SYSTEM_READ";
    public static final String SYSTEM_WRITE = PREFIX + "SYSTEM_WRITE";

    public static final String TAX_VERIFY = PREFIX + "TAX_VERIFY";

    private Permission() {
    }
}
