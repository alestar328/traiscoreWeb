import {RegClientFormData} from "../../models/UtilsInterfaces.tsx";


interface PropsRegClient {
    formData: RegClientFormData;
    isValid: boolean;
    formTouched: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoBack?: () => void;
}

export const RegClientForm: React.FC<PropsRegClient> = ({formData,onGoBack,isValid,formTouched,onChange,onSubmit}) => (
    <div className="signup-card">
        <h2>Datos adicionales (Cliente)</h2>
        {onGoBack && (
            <button type="button" onClick={onGoBack}>
                Volver
            </button>
        )}

        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="gender">Género</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                >
                    <option value="">Selecciona género</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                    <option value="other">Otro</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="Ej. +34 600 123 456"
                />
            </div>

            <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    placeholder="Calle, número, ciudad..."
                />
            </div>

            {/* Grid de medidas: 3 columnas x 3 */}
            <div className="measurements-grid">
                <div className="form-group">
                    <label htmlFor="height">Altura (cm)</label>
                    <input
                        id="height"
                        type="number"
                        name="measurements.height"
                        value={formData.measurements.height}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Peso (kg)</label>
                    <input
                        id="weight"
                        type="number"
                        name="measurements.weight"
                        value={formData.measurements.weight}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="neck">Cuello (cm)</label>
                    <input
                        id="neck"
                        type="number"
                        name="measurements.neck"
                        value={formData.measurements.neck}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="chest">Pecho (cm)</label>
                    <input
                        id="chest"
                        type="number"
                        name="measurements.chest"
                        value={formData.measurements.chest}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="arms">Brazos (cm)</label>
                    <input
                        id="arms"
                        type="number"
                        name="measurements.arms"
                        value={formData.measurements.arms}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="waist">Cintura (cm)</label>
                    <input
                        id="waist"
                        type="number"
                        name="measurements.waist"
                        value={formData.measurements.waist}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="thigh">Muslo (cm)</label>
                    <input
                        id="thigh"
                        type="number"
                        name="measurements.thigh"
                        value={formData.measurements.thigh}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="calf">Pantorrilla (cm)</label>
                    <input
                        id="calf"
                        type="number"
                        name="measurements.calf"
                        value={formData.measurements.calf}
                        onChange={onChange}
                    />
                </div>
            </div>

            <button
                type="submit"
                className={isValid && formTouched ? "btn-submit" : "btn-disabled"}
                disabled={!isValid || !formTouched}
            >
                {formTouched ? "Finalizar registro" : "..."}
            </button>

            {!isValid && formTouched && (
                <p>Completa todos los campos correctamente</p>
            )}
        </form>
    </div>
);
