import React, { useState } from "react";

export const QuestionForm = ({ onChange }) => {
    const [formData, setFormData] = useState({
        goal: "",
        target_column: "",
        domain: "",
        use_case: "",
        automation: "",
        missing_strategy: "",
        outlier_strategy: "",
        encoding: "",
        scaling: "",
        feature_engineering: "",
        custom_notes: ""
    });

    const [customInputs, setCustomInputs] = useState({});

    const updateParent = (newFormData, newCustomInputs) => {
        const finalData = {
            ...newFormData
        };

        Object.keys(newCustomInputs).forEach(key => {
            if (newFormData[key] === "custom") {
                finalData[key] = newCustomInputs[key];
            }
        });

        // stringify for backend
        onChange(JSON.stringify(finalData));
    };

    const handleChange = (field, value) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);
        updateParent(newFormData, customInputs);
    };

    const handleCustomChange = (field, value) => {
        const newCustomInputs = { ...customInputs, [field]: value };
        setCustomInputs(newCustomInputs);
        updateParent(formData, newCustomInputs);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Goal</label>
                <select value={formData.goal} onChange={(e) => handleChange("goal", e.target.value)} className="form-select">
                    <option value="">Select an objective</option>
                    <option value="classification">Predict category (Yes/No, Type)</option>
                    <option value="regression">Predict number (Price, Score)</option>
                    <option value="analysis">Just explore & understand data</option>
                    <option value="clustering">Group similar data</option>
                    <option value="custom">Something else</option>
                </select>
                {formData.goal === "custom" && (
                    <input style={{ marginTop: '0.5rem' }} className="form-input" placeholder="Describe your goal..." onChange={(e) => handleCustomChange("goal", e.target.value)} />
                )}
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Target Column</label>
                <input className="form-input" placeholder="Example: price, churn" onChange={(e) => handleChange("target_column", e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Domain</label>
                <select value={formData.domain} onChange={(e) => handleChange("domain", e.target.value)} className="form-select">
                    <option value="">Select a domain</option>
                    <option value="finance">Finance (money, transactions)</option>
                    <option value="healthcare">Healthcare (patients)</option>
                    <option value="ecommerce">E-commerce (orders, customers)</option>
                    <option value="general">General / Not sure</option>
                    <option value="custom">Other</option>
                </select>
                {formData.domain === "custom" && (
                    <input style={{ marginTop: '0.5rem' }} className="form-input" placeholder="Describe domain..." onChange={(e) => handleCustomChange("domain", e.target.value)} />
                )}
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Missing Strategy</label>
                <select value={formData.missing_strategy} onChange={(e) => handleChange("missing_strategy", e.target.value)} className="form-select">
                    <option value="">Select a strategy</option>
                    <option value="mean">Average value</option>
                    <option value="median">Middle value</option>
                    <option value="mode">Most common</option>
                    <option value="remove">Remove rows</option>
                    <option value="auto">Let AI decide</option>
                    <option value="custom">Custom</option>
                </select>
                {formData.missing_strategy === "custom" && (
                    <input style={{ marginTop: '0.5rem' }} className="form-input" placeholder="Custom method..." onChange={(e) => handleCustomChange("missing_strategy", e.target.value)} />
                )}
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Outlier Strategy</label>
                <select value={formData.outlier_strategy} onChange={(e) => handleChange("outlier_strategy", e.target.value)} className="form-select">
                    <option value="">Select action</option>
                    <option value="remove">Remove them</option>
                    <option value="cap">Limit (Cap)</option>
                    <option value="keep">Keep as is</option>
                    <option value="auto">Let AI decide</option>
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Automation</label>
                <select value={formData.automation} onChange={(e) => handleChange("automation", e.target.value)} className="form-select">
                    <option value="">Select automation</option>
                    <option value="auto">Fully automatic</option>
                    <option value="semi">Suggest steps (recommended)</option>
                    <option value="manual">Manual control</option>
                </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }}>
                <label>Custom Notes</label>
                <textarea className="form-input" style={{ width: '100%', boxSizing: 'border-box' }} rows={2} placeholder="Any specific requirements?" onChange={(e) => handleChange("custom_notes", e.target.value)} />
            </div>
        </div>
    );
}

export default QuestionForm;
