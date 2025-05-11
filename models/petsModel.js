class Pet {
  constructor({ name, species, age, description, available, createdAt, updatedAt }) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.description = description;
    this.available = available;
    const now = new Date().toISOString();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }
}

module.exports = Pet;
