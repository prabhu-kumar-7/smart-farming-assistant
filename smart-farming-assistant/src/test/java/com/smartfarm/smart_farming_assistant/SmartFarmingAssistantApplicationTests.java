package com.smartfarm.smart_farming_assistant;

import com.smartfarm.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SmartFarmingAssistantApplicationTests {

	@Autowired
	private UserRepository userRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void seededDemoUserMustExist() {
		assertTrue(userRepository.existsByEmail("ravi@gmail.com"));
	}

}
