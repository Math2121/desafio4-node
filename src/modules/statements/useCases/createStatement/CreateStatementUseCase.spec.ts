import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let userRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Create Statements", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementsRepository
    );
  });

  it("should not to create new statements if user not exists ", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "teste",
        amount: 0,
        description: "teste",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("should be able create a new statement if type for withdraw ", async () => {
    const user = await userRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "teste",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: "teste",
    });

    expect(statementOperation).toHaveProperty("user_id");
  });
  it("should not create a statement if  amount more than balance", async () => {
    const user = await userRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "teste",
    });
  });
});
