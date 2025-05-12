class AdoptionRequest {
  constructor({ user_id, user_email, pet_id, pet_name, status = "pending", requestedAt, updatedAt }) {
    this.user_id = user_id;
    this.user_email = user_email;
    this.pet_id = pet_id;
    this.pet_name = pet_name;
    this.status = status;
    const now = new Date().toISOString();
    this.requestedAt = requestedAt || now;
    this.updatedAt = updatedAt || now;
  }
}

module.exports = AdoptionRequest;