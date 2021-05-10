export namespace USER {
  export interface LoginPayload {
    username: string;
    password: string;
  }

  export interface UserDbItem {
    uid: number;
    email: string;
    phone?: string;
    password: string;
    nickname: string;
    role: Role;
    create_at: string;
    isDelete: boolean;
  }

  export interface RegisterPayload {
    nickname: string;
    email: string;
    phone?: string;
    password: string;
  }

  export interface Session {
    uid: number;
    nickname: string;
    email: string;
    phone?: string;
    role: Role;
  }

  export interface Info {
    nickname: string;
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
  }
}
