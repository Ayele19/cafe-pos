package com.example.cafe_pos.config;

import com.example.cafe_pos.security.AppRole;
import com.example.cafe_pos.security.RolePermissionMapping;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final String defaultRole;

    public KeycloakRoleConverter(
            @Value("${cafe.pos.rbac.default-role:cashier}") String defaultRole
    ) {
        this.defaultRole = defaultRole;
    }

    @Override
    public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
        Set<AppRole> appRoles = EnumSet.noneOf(AppRole.class);

        collectRoles(jwt.getClaim("realm_access"), appRoles);

        Object resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess instanceof Map<?, ?> clients) {
            for (Object client : clients.values()) {
                collectRoles(client, appRoles);
            }
        }

        Object groups = jwt.getClaim("groups");
        if (groups instanceof List<?> groupList) {
            for (Object group : groupList) {
                if (group instanceof String groupName) {
                    AppRole.fromTokenRole(groupName).ifPresent(appRoles::add);
                }
            }
        }

        Object rolesClaim = jwt.getClaim("roles");
        if (rolesClaim instanceof List<?> extraRoles) {
            for (Object role : extraRoles) {
                if (role instanceof String roleName) {
                    AppRole.fromTokenRole(roleName).ifPresent(appRoles::add);
                }
            }
        }

        if (appRoles.isEmpty()) {
            AppRole.fromTokenRole(defaultRole).ifPresent(appRoles::add);
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        for (AppRole role : appRoles) {
            authorities.add(new SimpleGrantedAuthority(role.springRole()));
        }
        for (String permission : RolePermissionMapping.permissionsFor(appRoles)) {
            authorities.add(new SimpleGrantedAuthority(permission));
        }
        return authorities;
    }

    private void collectRoles(Object accessClaim, Set<AppRole> appRoles) {
        if (!(accessClaim instanceof Map<?, ?> accessMap)) {
            return;
        }
        Object roles = accessMap.get("roles");
        if (!(roles instanceof List<?> roleList)) {
            return;
        }
        for (Object role : roleList) {
            if (role instanceof String roleName) {
                AppRole.fromTokenRole(roleName).ifPresent(appRoles::add);
            }
        }
    }
}
