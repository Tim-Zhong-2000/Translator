import { Friend, User } from "@prisma/client";

export namespace USER {
  export interface LoginPayload {
    email: string;
    password: string;
  }

  export interface Entity {
    uid: number;
    email: number;
    phone: number;
    password: number;
    name: string;
    role: Role;
    create_at: number;
    isDelete: number;
  }
  export interface UserDbItem {
    uid: number;
    email: string;
    phone?: string;
    password: string;
    name: string;
    role: Role;
    create_at: string;
    isDelete: boolean;
    friends: string; // JSON.stringify(number[])
    friendreq: string; // JSON.stringify(number[]) 请求队列
    friendres: string; // JSON.stringify(number[]) 接收好友队列
  }

  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
  }

  export interface Session {
    uid: number;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    friends: {
      uid: number;
      name: string;
      role: number;
    }[];
    friendreq: {
      uid: number;
      name: string;
      role: number;
    }[];
    friendres: {
      uid: number;
      name: string;
      role: number;
    }[];
  }

  export interface Info {
    name: string;
    email: string;
    phone?: string;
  }

  /* 数字越大权限越高 */
  export enum Role {
    "guest", // + 下载权限
    "user", // + 发布权限
    "translator", // + 验证权限
    "admin", // + 最高权限
  }

  export enum DBError {
    "NOT_EXIST",
    "AUTH_FAIL",
    "COUNT_TOOMUCH",
    "INTERNAL_ERROR",
    "TYPE_UNSAFE", // 用于初始化sql的变量类型非法
  }

  export enum PrivacyLabel {
    "public",
    "friend",
    "own",
  }
}
