import { FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';

const DropDown = ({ options, setSelectedOption}) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={`${open ? 'pb-48' : 'pb-10 transition-padding duration-1000'} bg-[#6345bc] `}
        >
            <motion.div animate={open ? 'open' : 'closed'} className="relative">
                <button
                    onClick={() => setOpen((pv) => !pv)}
                    className="h-11 flex items-center gap-2 p-3 py-2 rounded-md text-indigo-50 bg-[#6345bc] border-1 border-gray-500 hover:bg-purple-700 transition-colors"
                >
                    <span className="font-medium text-l">🇬🇧 🇨🇳 🇪🇸 🇮🇳</span>
                    <motion.span variants={iconVariants}>
                        <FiChevronDown />
                    </motion.span>
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: 'top', translateX: '-50%' }}
                    className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] right-[-78%] w-48 overflow-hidden "
                >
                    {options.map((val) => (
                        <Option
                            setOpen={setOpen}
                            setSelectedOption={setSelectedOption}
                            text={val.label}
                            key={val.label}
                            value={val.value}
                            />
                    ))}
                </motion.ul>
            </motion.div>
        </div>
    );
};

const Option = ({ text, setOpen, setSelectedOption,value }) => {
    const handleClick = () => {
        console.log("Selected option:", value); // Debugging
        setSelectedOption(value);
        setOpen(false);
    };
    return (
        <motion.li
            variants={itemVariants}
            onClick={handleClick}
            className="flex items-center gap-1 w-full p-1 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
        >
            <span>{text}</span>
        </motion.li>
    );
};

export default DropDown;

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.0,
        },
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: 'beforeChildren',
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: 'afterChildren',
            duration: 0.1,
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};
