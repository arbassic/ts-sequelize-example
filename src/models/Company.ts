import { db } from "../db";
import { Model, DataTypes } from "sequelize";

export class Company extends Model<Company> {
  public id!: number;
  public name!: string;
  public logoUrl!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
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
    logoUrl: {
      type: DataTypes.STRING(128),
      allowNull: true
    }
  },
  {
    sequelize: db,
  }
);
