import { db } from "../db";
import { Model, DataTypes } from "sequelize";

export class UserPrivilege extends Model<UserPrivilege> {
  public id!: number;
  public userId!: number;
  public name!: string;
}

UserPrivilege.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false
    }
  },
  {
    sequelize: db,
    updatedAt: false
  }
);
