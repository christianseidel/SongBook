package songbook.users.authentification;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtUtils {

    private final SecretKey signingKey;

    public JwtUtils(@Value("${app.jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
    }

    public String createToken(Map<String, Object> claims, String subject) {
        Instant now = Instant.now();

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofHours(72))))
                .signWith(signingKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
