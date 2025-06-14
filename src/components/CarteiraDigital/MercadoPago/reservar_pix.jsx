//**mostrar  aqui um formulario onde ele vai poder reservar um pix diretamente na conta do estabelecimento pelo Id,Nome e valor desejado */
//** vai ter input nome completo, cpf, email, telefone,valor a reservar*/
//**vai ter o botao que vai direcionar para o link para fazer o pix  */
//**vai ter strong com saldo anterior */
//**page vai ter a interface do mercado pago como referencia da api usada */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reservarPix } from '../../../features/mercadoPagoSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Input, Form, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/formatCurrency';
const { Title } = Typography;   

const ReservarPix = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { saldoAnterior } = useSelector((state) => state.mercadoPago);
    
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        cpf: '',
        email: '',
        telefone: '',
        valor: ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(reservarPix(formData))
        .then(() => {
            toast.success(t('pix.reservaSucesso'));
            navigate('/mercado-pago');
        })
        .catch((error) => {
            toast.error(t('pix.reservaErro', { error: error.message }));
        });
    };
    
    return (
        <div className="reservar-pix-container">
        <Title level={2}>{t('pix.reservarTitulo')}</Title>
        <p>{t('pix.saldoAnterior', { saldo: formatCurrency(saldoAnterior) })}</p>
        <Form onSubmit={handleSubmit} layout="vertical">
            <Form.Item label={t('pix.nomeCompleto')}>
            <Input name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />
            </Form.Item>
            <Form.Item label={t('pix.cpf')}>
            <Input name="cpf" value={formData.cpf} onChange={handleChange} required />
            </Form.Item>
            <Form.Item label={t('pix.email')}>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </Form.Item>
            <Form.Item label={t('pix.telefone')}>
            <Input name="telefone" value={formData.telefone} onChange={handleChange} required />
            </Form.Item>
            <Form.Item label={t('pix.valor')}>
            <Input name="valor" type="number" value={formData.valor} onChange={handleChange} required />
            </Form.Item>
            <Button type="primary" htmlType="submit">{t('pix.reservar')}</Button>
        </Form>
        </div>
    );
    }