import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/auth`;

const initialState = {
  status: "",
  error: "",
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",

    // campos opcionais com valor padrão vazio
    tipoVeiculo: "",
    marca: "",
    cor: "",
    placa: "",
    chavePix: "",
    precoPorKm: "",
    precoPorMinuto: "",
    taxaFixa: "",
    descontoHorario: "",
    fotoCNH: "",
    fotoDocumentoVeiculo: "",
    fotoQrCode: "",
  },
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${AUTH_ENDPOINT}/register`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${AUTH_ENDPOINT}/login`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",

        tipoVeiculo: "",
        marca: "",
        cor: "",
        placa: "",
        chavePix: "",
        precoPorKm: "",
        precoPorMinuto: "",
        taxaFixa: "",
        descontoHorario: "",
        fotoCNH: "",
        fotoDocumentoVeiculo: "",
        fotoQrCode: "",
      };
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
  },
 extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";

        const user = action.payload.user;

        state.user = {
          id: user.id || "",
          name: user.name || "",
          email: user.email || "",
          picture: user.picture || "",
          status: user.status || "",
          token: user.token || "",

          tipoVeiculo: user.tipoVeiculo || "",
          marca: user.marca || "",
          cor: user.cor || "",
          placa: user.placa || "",
          chavePix: user.chavePix || "",
          precoPorKm: user.precoPorKm || "",
          precoPorMinuto: user.precoPorMinuto || "",
          taxaFixa: user.taxaFixa || "",
          descontoHorario: user.descontoHorario || "",
          fotoCNH: user.fotoCNH || "",
          fotoDocumentoVeiculo: user.fotoDocumentoVeiculo || "",
          fotoQrCode: user.fotoQrCode || "",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";

        const user = action.payload.user;

        state.user = {
          id: user.id || "",
          name: user.name || "",
          email: user.email || "",
          picture: user.picture || "",
          status: user.status || "",
          token: user.token || "",

          tipoVeiculo: user.tipoVeiculo || "",
          marca: user.marca || "",
          cor: user.cor || "",
          placa: user.placa || "",
          chavePix: user.chavePix || "",
          precoPorKm: user.precoPorKm || "",
          precoPorMinuto: user.precoPorMinuto || "",
          taxaFixa: user.taxaFixa || "",
          descontoHorario: user.descontoHorario || "",
          fotoCNH: user.fotoCNH || "",
          fotoDocumentoVeiculo: user.fotoDocumentoVeiculo || "",
          fotoQrCode: user.fotoQrCode || "",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, changeStatus } = userSlice.actions;

export default userSlice.reducer;
