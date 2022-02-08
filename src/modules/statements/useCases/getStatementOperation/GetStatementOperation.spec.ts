import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationuseCase: GetStatementOperationUseCase;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("Statements Operations", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationuseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should not be able give information if user not exists", () => {
    expect(async () => {
      await getStatementOperationuseCase.execute({
        user_id: "teste",
        statement_id: "teste",
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able give information if do not exist", async () => {
    const user = await usersRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });

    expect(async () => {
      await getStatementOperationuseCase.execute({
        user_id: user.id as string,
        statement_id: "teste",
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
  it("should be able give information", async () => {
    const user = await usersRepository.create({
      name: "Teste",
      email: "teste@example.com",
      password: "123456",
    });
    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "teste",
    });
    const statementInfo = await getStatementOperationuseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementInfo).toHaveProperty('id')
    expect(statementInfo).toHaveProperty('user_id')
  });
});
