import logger from "@/config/winston";
import Role from "@/models/Role";
import Unit from "@/models/Unit";
import { Role as Roles } from "@/types/Role";

const seedInitialRoles = async () => {
  // Define your roles
  const roles = Object.values(Roles).map((role) => ({ name: role }));

  // Check if any roles already exist to avoid re-seeding data
  const count = await Role.count();
  if (count === 0) {
    // Use bulkCreate to insert initial roles if they don't already exist
    await Role.bulkCreate(roles);
    logger.info("Roles seeded successfully.");
  } else {
    logger.info("Roles already exist, skipping seeding.");
  }
};

const seedInitialUnits = async () => {
  const units = [
    { name: "Kilograms (Kg)" },
    { name: "Pounds (lbs)" },
    { name: "Miles" },
    { name: "Kilometers (Km)" },
    { name: "Meters (m)" },
    { name: "Centimeters (cm)" },
    { name: "Inches (in)" },
    { name: "Calories" },
    { name: "Heart Rate (beats per minute)" },
    { name: "Watts (W)" },
    { name: "Time (seconds, minutes, hours)" },
    { name: "Percentage of 1RM (%1RM)" },
    { name: "Body Mass Index (BMI)" },
    { name: "Body Fat Percentage (%)" },
    { name: "Lean Body Mass (Kg or lbs)" },
    { name: "Waist to Hip Ratio" },
    { name: "Circumferences (cm or in)" },
    { name: "Degrees (°)" },
    { name: "VO2 Max (ml/kg/min)" },
    { name: "Pace (minutes per km or mile)" },
    { name: "Stroke Rate (strokes per minute)" },
    { name: "Newton Meters (Nm)" },
    { name: "Pound-Feet (lb-ft)" },
    { name: "Velocity (m/s)" },
    { name: "Work to Rest Ratio" },
    { name: "Intervals" },
    { name: "Repetitions" },
    { name: "Sets" },
  ];

  // Check if any roles already exist to avoid re-seeding data
  const count = await Unit.count();
  if (count === 0) {
    // Use bulkCreate to insert initial roles if they don't already exist
    await Unit.bulkCreate(units);
    logger.info("Units seeded successfully.");
  } else {
    logger.info("Units already exist, skipping seeding.");
  }
};

const seedData = async () => {
  seedInitialRoles();
  seedInitialUnits();
};

export default seedData;
