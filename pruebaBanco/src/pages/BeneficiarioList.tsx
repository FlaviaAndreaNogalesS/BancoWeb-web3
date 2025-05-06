import { useEffect, useState } from "react";
import { Beneficiario } from "../models/Beneficiario";
import { BeneficiarioService } from "../services/BeneficiarioService";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { CuentaService } from "../services/CuentaService";

const BeneficiarioList = () => {
    //estados pa gestionar lista, nuevo bene y edicion
    const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
    const [nuevo, setNuevo] = useState<Beneficiario>({ nombre: "", nro_cuenta: "" });
    const [modoEdicion, setModoEdicion] = useState<number | null>(null);
    const [beneficiarioEditado, setBeneficiarioEditado] = useState<Beneficiario>({ nombre: "", nro_cuenta: "" });

    //carga los bene
    useEffect(() => {
        cargar();
    }, []);

    const cargar = () => {
        new BeneficiarioService().getAll().then(setBeneficiarios);
    };

    const crear = () => {
        if (!nuevo.nombre || !nuevo.nro_cuenta) {
            return alert("Todos los campos son requeridos.");
        }
    
        // Verifica que la cuenta exista antes de guardar el beneficiario
        new CuentaService().verificarCuentaPorNumero(nuevo.nro_cuenta)
            .then(() => {
                // Si existe
                new BeneficiarioService().insert(nuevo)
                    .then(() => {
                        setNuevo({ nombre: "", nro_cuenta: "" });
                        cargar();
                        alert("Beneficiario agregado con éxito.");
                    })
                    .catch(err => alert(err.message));
            })
            .catch(() => {
                alert("El número de cuenta no existe. Verifica antes de continuar.");
            });
    };
    

    const eliminar = (id: number) => {
        new BeneficiarioService().delete(id).then(cargar);
    };

    const guardarEdicion = () => {
        if (!beneficiarioEditado.nombre || !beneficiarioEditado.nro_cuenta) {
            return alert("Todos los campos son requeridos.");
        }
    
        new CuentaService().verificarCuentaPorNumero(beneficiarioEditado.nro_cuenta)
            .then(() => {
                new BeneficiarioService().update(modoEdicion!, beneficiarioEditado)
                    .then(() => {
                        setModoEdicion(null); //sale del modo edit
                        setBeneficiarioEditado({ nombre: "", nro_cuenta: "" });
                        cargar();
                        alert("Beneficiario actualizado.");
                    });
            })
            .catch(() => {
                alert("El número de cuenta no existe. Verifica antes de continuar.");
            });
    };

    return (
        <Container>
            <Card title="Beneficiarios">
                <FormField>
                    <label>Nombre</label>
                    <Input value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
                </FormField>
                <FormField>
                    <label>Nro Cuenta</label>
                    <Input value={nuevo.nro_cuenta} onChange={e => setNuevo({ ...nuevo, nro_cuenta: e.target.value })} />
                </FormField>
                <Button title="Agregar" onClick={crear} />

                <hr className="my-4" />

                {beneficiarios.map(b => (
                    <div key={b.id} className="border-b py-2">
                        {modoEdicion === b.id ? (
                            <div className="flex flex-col gap-2">
                                <Input
                                value={beneficiarioEditado.nombre}
                                onChange={e => setBeneficiarioEditado({ ...beneficiarioEditado, nombre: e.target.value })}
                                placeholder="Nombre"/>
                                
                                <Input
                                value={beneficiarioEditado.nro_cuenta}
                                onChange={e => setBeneficiarioEditado({ ...beneficiarioEditado, nro_cuenta: e.target.value })}
                                placeholder="Nro Cuenta"/>
                                
                                <div className="flex gap-2">
                                    <Button title="Guardar" onClick={guardarEdicion} />
                                    <Button title="Cancelar" onClick={() => setModoEdicion(null)} />
                                </div>
                            </div>
            ) : (
                <div className="flex justify-between items-center">
                    <span>{b.nombre} - {b.nro_cuenta}</span>
                    <div className="flex gap-2">
                        <Button title="Editar" onClick={() => {
                            setModoEdicion(b.id!);
                            setBeneficiarioEditado({ nombre: b.nombre, nro_cuenta: b.nro_cuenta });
                        }} />
                        <Button title="Eliminar" onClick={() => eliminar(b.id!)} />
                    </div>
                </div>
            )}
        </div>
))}
            </Card>
        </Container>
    );
};

export default BeneficiarioList;
