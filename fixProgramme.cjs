
const fs = require('fs');
let code = fs.readFileSync('src/components/generated/ProgrammePage.tsx', 'utf8');

// 1. Fix the extra </div>
code = code.replace(
  '            </motion.a>\n            </div>\n          </motion.div>\n        </div>\n        {/* Bottom stats strip */}',
  '            </motion.a>\n          </motion.div>\n        </div>\n        {/* Bottom stats strip */}'
);

// 2. Fix the missing </motion.div> at the end of the section
code = code.replace(
  '        </motion.div>\n      </div>\n    </section>;\n};\n\n// --- Programme Footer',
  '        </motion.div>\n      </div>\n    </motion.div>\n    </section>;\n};\n\n// --- Programme Footer'
);

fs.writeFileSync('src/components/generated/ProgrammePage.tsx', code);

