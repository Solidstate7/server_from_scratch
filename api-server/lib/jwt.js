const Crypto = require("crypto");
require("dotenv").config();

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in the environment variables");
}

class JWT {
  constructor() {
    this.salt = process.env.JWT_SECRET_KEY;
  }

  sign(data, expiresIn = "1h") {
    this.validateData(data);
    const exp = Math.floor(Date.now() / 1000) + this.parseExpiresIn(expiresIn);
    const payload = this.encode({ ...data, exp });
    const header = this.encode({ typ: "JWT", alg: "HS256" });
    const base64url = [header, payload].join(".");
    const signature = this.createSignature(base64url);
    return [base64url, signature].join(".");
  }

  verify(token) {
    try {
      this.validateTokenFormat(token);
      const [header, payload, signature] = token.split(".");
      const base64url = [header, payload].join(".");
      this.validateSignature(base64url, signature);
      const result = this.decode(payload);
      this.validateTokenExpiration(result.exp);
      return result;
    } catch (e) {
      throw new Error(`JWT Token Verify Error: ${e.message}`);
    }
  }

  validateData(data) {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be a non-null object");
    }
  }

  validateTokenFormat(token) {
    if (!token || token.split(".").length !== 3) {
      throw new Error("Invalid token format");
    }
  }

  validateSignature(base64url, signature) {
    const newSignature = this.createSignature(base64url);
    if (signature !== newSignature) {
      throw new Error("Invalid token signature");
    }
  }

  validateTokenExpiration(expirationTime) {
    if (expirationTime < Math.floor(Date.now() / 1000)) {
      throw new Error("Token has expired");
    }
  }

  encode(obj) {
    return Buffer.from(JSON.stringify(obj)).toString("base64url");
  }

  decode(base64) {
    return JSON.parse(Buffer.from(base64, "base64url").toString("utf-8"));
  }

  createSignature(base64url) {
    return Crypto.createHmac("sha256", this.salt)
      .update(base64url)
      .digest("base64url");
  }

  parseExpiresIn(expiresIn) {
    const match = expiresIn.match(/(\d+)([hmsd])/);
    if (!match) throw new Error("Invalid expiresIn format");

    const [, count, unit] = match;
    const seconds =
      {
        h: 3600,
        m: 60,
        s: 1,
        d: 86400,
      }[unit.toLowerCase()] || 0;

    return parseInt(count, 10) * seconds;
  }
}

module.exports = JWT;
