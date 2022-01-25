import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create a Session", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should not exists email user in database", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "",
        password: "12354",
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not to be able create a session with the wrong password", async () => {
    const newUser = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    const newSession = authenticateUserUseCase.execute({
      email: newUser.email,
      password: "teste",
    });
    expect(newSession).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should be able create a session", async () => {
    const newUser = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    const test = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: "123456",
    });
    // console.log(test.user)
    expect(test).toHaveProperty("user");
    expect(test).toHaveProperty("token");
  });
});
