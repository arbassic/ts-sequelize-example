import { db } from "../db";
import { Model, DataTypes } from "sequelize";

export class ActivityLog extends Model<ActivityLog> {
  public id!: number;
  public userId!: number;
  public activityType!: string;
  public params!: string;
  public readonly createdAt!: Date;
}

ActivityLog.init(
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
    activityType: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    params: {
      type: DataTypes.STRING(128)
    }
  },
  {
    sequelize: db,
    updatedAt: false
  }
);
