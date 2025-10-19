import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PrivacyPolicy.css'; // Reusing the same styles

const LegalCompliance: React.FC = () => {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-header">
                <h1>Legal Compliance & User Rights</h1>
                <p className="last-updated">Your rights and our commitment to legal compliance</p>
            </div>

            <div className="privacy-policy-content">
                <section className="privacy-section">
                    <h2>Our Commitment to Legal Compliance</h2>
                    <p>
                        TraisCore is committed to maintaining the highest standards of legal compliance and protecting your rights as a user. We adhere to international privacy laws and regulations to ensure your data is handled responsibly and transparently.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>Compliance with International Laws</h2>
                    
                    <h3>General Data Protection Regulation (GDPR)</h3>
                    <p>
                        For users in the European Union, we comply with GDPR requirements including:
                    </p>
                    <ul>
                        <li>Lawful basis for data processing</li>
                        <li>Data minimization and purpose limitation</li>
                        <li>Transparent privacy notices</li>
                        <li>User rights to access, rectification, erasure, and portability</li>
                        <li>Data breach notification requirements</li>
                        <li>Privacy by design and by default</li>
                    </ul>

                    <h3>California Consumer Privacy Act (CCPA)</h3>
                    <p>
                        For California residents, we provide:
                    </p>
                    <ul>
                        <li>Right to know about personal information collected</li>
                        <li>Right to delete personal information</li>
                        <li>Right to opt-out of sale of personal information</li>
                        <li>Right to non-discrimination for exercising privacy rights</li>
                    </ul>

                    <h3>Children's Online Privacy Protection Act (COPPA)</h3>
                    <p>
                        We do not knowingly collect personal information from children under 13. Users between 13-18 should have parental guidance when using our services.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>Your Rights and How to Exercise Them</h2>
                    
                    <div className="rights-grid">
                        <div className="right-card">
                            <h4>📋 Access Your Data</h4>
                            <p>Request a copy of all personal data we hold about you</p>
                            <Link to="/privacy-policy" className="right-link">Learn More</Link>
                        </div>

                        <div className="right-card">
                            <h4>✏️ Correct Your Data</h4>
                            <p>Update or correct inaccurate personal information</p>
                            <a href="#profile" className="right-link">Update Profile</a>
                        </div>

                        <div className="right-card">
                            <h4>🗑️ Delete Your Data</h4>
                            <p>Request permanent deletion of your personal data</p>
                            <Link to="/data-deletion-request" className="right-link">Request Deletion</Link>
                        </div>

                        <div className="right-card">
                            <h4>📦 Export Your Data</h4>
                            <p>Download your data in a portable format</p>
                            <a href="#export" className="right-link">Export Data</a>
                        </div>

                        <div className="right-card">
                            <h4>🚫 Opt-Out of Marketing</h4>
                            <p>Unsubscribe from marketing communications</p>
                            <a href="#preferences" className="right-link">Manage Preferences</a>
                        </div>

                        <div className="right-card">
                            <h4>🍪 Cookie Preferences</h4>
                            <p>Manage your cookie and tracking preferences</p>
                            <a href="#cookies" className="right-link">Cookie Settings</a>
                        </div>
                    </div>
                </section>

                <section className="privacy-section">
                    <h2>Data Protection Measures</h2>
                    
                    <h3>Technical Safeguards</h3>
                    <ul>
                        <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                        <li><strong>Access Controls:</strong> Strict role-based access controls with multi-factor authentication</li>
                        <li><strong>Network Security:</strong> Firewalls, intrusion detection, and regular security audits</li>
                        <li><strong>Data Backup:</strong> Regular encrypted backups with secure off-site storage</li>
                    </ul>

                    <h3>Organizational Measures</h3>
                    <ul>
                        <li><strong>Staff Training:</strong> Regular privacy and security training for all employees</li>
                        <li><strong>Data Processing Agreements:</strong> Contractual safeguards with all third-party processors</li>
                        <li><strong>Incident Response:</strong> Comprehensive data breach response procedures</li>
                        <li><strong>Privacy Impact Assessments:</strong> Regular assessments of data processing activities</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>Third-Party Integrations</h2>
                    <p>
                        We work with trusted third-party service providers who help us deliver our services. All third-party integrations are subject to:
                    </p>
                    <ul>
                        <li>Data Processing Agreements (DPAs) with appropriate safeguards</li>
                        <li>Regular security assessments and audits</li>
                        <li>Compliance with applicable privacy laws</li>
                        <li>Limited data sharing only for necessary service provision</li>
                    </ul>

                    <h3>Current Third-Party Services</h3>
                    <ul>
                        <li><strong>Hosting:</strong> Secure cloud infrastructure with enterprise-grade security</li>
                        <li><strong>Analytics:</strong> Privacy-focused analytics with data minimization</li>
                        <li><strong>Payment Processing:</strong> PCI DSS compliant payment processors</li>
                        <li><strong>Email Services:</strong> Secure email delivery with encryption</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>International Data Transfers</h2>
                    <p>
                        Your data may be transferred to and processed in countries outside your country of residence. We ensure appropriate safeguards are in place for such transfers, including:
                    </p>
                    <ul>
                        <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                        <li>Adequacy decisions by relevant data protection authorities</li>
                        <li>Certification schemes and codes of conduct</li>
                        <li>Binding corporate rules where applicable</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>Data Retention Policy</h2>
                    <p>
                        We retain your personal data only for as long as necessary to:
                    </p>
                    <ul>
                        <li>Provide our services to you</li>
                        <li>Comply with legal obligations</li>
                        <li>Resolve disputes and enforce our agreements</li>
                        <li>Protect against fraud and abuse</li>
                    </ul>

                    <h3>Retention Periods</h3>
                    <ul>
                        <li><strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
                        <li><strong>Fitness Data:</strong> Until account deletion or user request</li>
                        <li><strong>Payment Information:</strong> As required by financial regulations (typically 7 years)</li>
                        <li><strong>Support Communications:</strong> 3 years for quality improvement purposes</li>
                        <li><strong>Analytics Data:</strong> Anonymized after 26 months</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>Contact Our Privacy Team</h2>
                    <p>
                        For any privacy-related questions, concerns, or requests, please contact our dedicated privacy team:
                    </p>
                    
                    <div className="contact-info">
                        <p><strong>Privacy Officer:</strong> privacy@traiscore.com</p>
                        <p><strong>Data Protection Officer (EU):</strong> dpo@traiscore.com</p>
                        <p><strong>General Support:</strong> support@traiscore.com</p>
                        <p><strong>Response Time:</strong> Within 72 hours for privacy requests</p>
                        <p><strong>Address:</strong> [Your Company Address]</p>
                    </div>

                    <h3>Making a Complaint</h3>
                    <p>
                        If you believe we have not handled your personal data in accordance with applicable laws, you have the right to lodge a complaint with your local data protection authority.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>Regular Updates and Monitoring</h2>
                    <p>
                        We regularly review and update our privacy practices to ensure continued compliance with evolving laws and regulations. This includes:
                    </p>
                    <ul>
                        <li>Annual privacy policy reviews and updates</li>
                        <li>Regular staff training on privacy laws and best practices</li>
                        <li>Periodic security audits and vulnerability assessments</li>
                        <li>Monitoring of regulatory developments and guidance</li>
                        <li>Implementation of privacy-enhancing technologies</li>
                    </ul>
                </section>
            </div>

            <div className="privacy-policy-footer">
                <div className="navigation-links">
                    <Link to="/privacy-policy" className="nav-link">← Privacy Policy</Link>
                    <Link to="/terms-of-service" className="nav-link">Terms of Service →</Link>
                </div>
                <div className="policy-actions">
                    <button className="action-button print-button" onClick={() => window.print()}>
                        Print Page
                    </button>
                    <Link to="/data-deletion-request" className="action-button download-button">
                        Request Data Deletion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LegalCompliance;
