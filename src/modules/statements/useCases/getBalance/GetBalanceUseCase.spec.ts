import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Balance", () => {
  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      userRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementRepository
    );
  });

  it("should not to show balance information when the user is not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "teste" });
    }).rejects.toEqual(new GetBalanceError());
  });

  it("should be able show balance information", async () => {
    const user = await userRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "teste",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 500,
      description: "teste 2",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: `${user.id}`,
    });

    expect(getBalance).toHaveProperty("balance");
    expect(getBalance).toHaveProperty("statement");
  });
});
