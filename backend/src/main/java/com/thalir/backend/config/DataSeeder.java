package com.thalir.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.thalir.backend.model.ERole;
import com.thalir.backend.model.Role;
import com.thalir.backend.repository.RoleRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_FARMER));
            roleRepository.save(new Role(ERole.ROLE_CONSUMER));
            roleRepository.save(new Role(ERole.ROLE_PROVIDER));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
        }
    }
}
