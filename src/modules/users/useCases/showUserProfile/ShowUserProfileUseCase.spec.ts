import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepository: InMemoryUsersRepository;
describe("Show User Profile", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  });
  it("should not show user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("5");
    }).rejects.toEqual(new ShowUserProfileError());
  });

  it("should be able show user profile", async () => {
    const user = await userRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
   
    const profile = await showUserProfileUseCase.execute(String(user.id))
    expect(profile).toHaveProperty("id")
    expect(profile).toHaveProperty("email")
  });
});
