import { db } from "../db";
import { Model, DataTypes } from "sequelize";
import { UserPrivilege } from "./UserPrivilege";
import * as bcrypt from 'bcrypt';


export class User extends Model<User> {
  public id!: number;
  public name!: string;
  public status!: string;
  public passwordHash!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly privileges: UserPrivilege[];

  public async checkPassword(password: string) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(16),
      defaultValue: 'active'
    }
  },
  {
    sequelize: db
  }
);
