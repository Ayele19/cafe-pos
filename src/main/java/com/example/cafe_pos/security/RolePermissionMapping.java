package com.example.cafe_pos.security;

import java.util.Collections;
import java.util.EnumMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public final class RolePermissionMapping {

    private static final Map<AppRole, Set<String>> MATRIX = new EnumMap<>(AppRole.class);

    static {
        MATRIX.put(AppRole.ADMIN, Set.of(
                Permission.MENU_READ, Permission.MENU_WRITE,
                Permission.ORDER_READ, Permission.ORDER_CREATE,
                Permission.CUSTOMER_READ, Permission.CUSTOMER_WRITE, Permission.CUSTOMER_DELETE,
                Permission.SELLER_READ, Permission.SELLER_WRITE,
                Permission.SYSTEM_READ, Permission.SYSTEM_WRITE,
                Permission.TAX_VERIFY
        ));

        MATRIX.put(AppRole.MANAGER, Set.of(
                Permission.MENU_READ, Permission.MENU_WRITE,
                Permission.ORDER_READ, Permission.ORDER_CREATE,
                Permission.CUSTOMER_READ, Permission.CUSTOMER_WRITE, Permission.CUSTOMER_DELETE,
                Permission.SELLER_READ, Permission.SELLER_WRITE,
                Permission.SYSTEM_READ, Permission.SYSTEM_WRITE,
                Permission.TAX_VERIFY
        ));

        MATRIX.put(AppRole.CASHIER, Set.of(
                Permission.MENU_READ,
                Permission.ORDER_READ, Permission.ORDER_CREATE,
                Permission.CUSTOMER_READ, Permission.CUSTOMER_WRITE,
                Permission.SELLER_READ,
                Permission.SYSTEM_READ, Permission.SYSTEM_WRITE
        ));

        MATRIX.put(AppRole.AUDITOR, Set.of(
                Permission.MENU_READ,
                Permission.ORDER_READ,
                Permission.CUSTOMER_READ,
                Permission.SELLER_READ,
                Permission.SYSTEM_READ,
                Permission.TAX_VERIFY
        ));
    }

    private RolePermissionMapping() {
    }

    public static Set<String> permissionsFor(AppRole role) {
        return MATRIX.getOrDefault(role, Set.of());
    }

    public static Set<String> permissionsFor(Set<AppRole> roles) {
        Set<String> permissions = new LinkedHashSet<>();
        for (AppRole role : roles) {
            permissions.addAll(permissionsFor(role));
        }
        return Collections.unmodifiableSet(permissions);
    }
}
