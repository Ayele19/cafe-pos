package com.example.cafe_pos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CafeposApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void testEnvVariables() {
        String clientId = System.getenv("TAXAPI_CLIENT_ID");
        String clientSecret = System.getenv("TAXAPI_CLIENT_SECRET");
        String apiKey = System.getenv("TAXAPI_API_KEY");
        String tin = System.getenv("TAXAPI_Taxpayer_TIN");

        System.out.println("Client ID = " + clientId);
        System.out.println("Client Secret = " + clientSecret);
        System.out.println("API Key = " + apiKey);
        System.out.println("TIN = " + tin);

        assert clientId != null && !clientId.isEmpty();
        assert clientSecret != null && !clientSecret.isEmpty();
        assert apiKey != null && !apiKey.isEmpty();
        assert tin != null && !tin.isEmpty();
    }
}
