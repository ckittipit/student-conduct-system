import { JwtService } from '@nestjs/jwt';

const jwt = new JwtService({ secret: 'supersecretkey_changethis' });

const token = jwt.sign({
    sub: 'cmqox6b760000136msoxiij4o',
    email: 'test@mail.com',
    role: 'ADMIN',
});

console.log(token);