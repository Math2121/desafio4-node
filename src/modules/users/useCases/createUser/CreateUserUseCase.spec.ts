import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Create a User", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be able create a new user", async () => {
    const newUser = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    expect(newUser).toHaveProperty("name");
  });
  it("should not to be able create a new user with email address already exist ", async () => {
    await createUserUseCase.execute({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    expect(async () => {
      await createUserUseCase.execute({
        name: "Teste",
        email: "teste@example.com",
        password: "123456",
      });
    }).rejects.toEqual(new CreateUserError());
  });
});
