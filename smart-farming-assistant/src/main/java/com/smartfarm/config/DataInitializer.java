package com.smartfarm.config;

import com.smartfarm.model.User;
import com.smartfarm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override 
    public void run(ApplicationArguments args) {
        String demoEmail = "ravi@gmail.com";
        if (!userRepository.existsByEmail(demoEmail)) {
            User user = new User();
            user.setFullName("Ravi Kumar");
            user.setEmail(demoEmail);
            user.setPasswordHash(passwordEncoder.encode("1234"));
            user.setRole("farmer");
            userRepository.save(user);
        }
    }
}
