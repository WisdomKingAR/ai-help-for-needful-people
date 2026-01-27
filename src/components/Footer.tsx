import { Accessibility, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Accessibility className="text-primary" size={32} />
                        <span className="text-2xl font-bold">Accessibility AI</span>
                    </div>
                    <p className="text-white/60 text-lg max-w-sm mb-8 leading-relaxed">
                        Leading the charge in ethical AI for digital accessibility.
                        Join us in creating a world where no one is left behind.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-3 glass rounded-xl hover:text-primary transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="p-3 glass rounded-xl hover:text-primary transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="p-3 glass rounded-xl hover:text-primary transition-colors"><Github size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-lg">Product</h4>
                    <ul className="space-y-4 text-white/50">
                        <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-lg">Company</h4>
                    <ul className="space-y-4 text-white/50">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/30">
                &copy; 2026 Accessibility AI. All rights reserved.
            </div>
        </footer>
    );
};
