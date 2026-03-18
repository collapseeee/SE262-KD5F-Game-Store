-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Table `kd5f`.`Account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Account` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Account` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` CHAR(255) NULL DEFAULT NULL,
  `password` CHAR(255) NULL DEFAULT NULL,
  `create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_sell` FLOAT NULL DEFAULT '0',
  `total_spend` FLOAT NULL DEFAULT '0',
  `game_purchase` INT NULL DEFAULT '0',
  `isBuyer` TINYINT NOT NULL DEFAULT '0',
  `isSeller` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Category` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Category` (
  `category_id` INT NOT NULL,
  `category_name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Product` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Product` (
  `product_id` INT NOT NULL,
  `product_name` CHAR(255) NULL DEFAULT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `price` FLOAT NULL DEFAULT NULL,
  `release_date` DATE NULL DEFAULT NULL,
  `category_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `Product_ibfk_1`
    FOREIGN KEY (`category_id`)
    REFERENCES `kd5f`.`Category` (`category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Cart`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Cart` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Cart` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `add_date` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `product_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `Cart_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kd5f`.`Account` (`user_id`),
  CONSTRAINT `Cart_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Images`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Images` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Images` (
  `image_id` INT NOT NULL,
  `image_url` TEXT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  INDEX `product_id_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Order` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Order` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `payment_method` CHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `product_id`, `order_date`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `Order_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kd5f`.`Account` (`user_id`),
  CONSTRAINT `Order_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`hardware_requirement`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`hardware_requirement` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`hardware_requirement` (
  `requirement_id` INT NOT NULL,
  `processor` VARCHAR(145) NULL,
  `memory` VARCHAR(145) NULL,
  `graphics_card` VARCHAR(145) NULL,
  `directx_version` VARCHAR(145) NULL,
  `network` VARCHAR(145) NULL,
  `storage` VARCHAR(145) NULL,
  `soundcard` VARCHAR(145) NULL,
  `additional_note` VARCHAR(255) NULL,
  PRIMARY KEY (`requirement_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kd5f`.`Product_List`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Product_List` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Product_List` (
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `release_date` DATE NULL DEFAULT NULL,
  `requirement_id` INT NULL,
  PRIMARY KEY (`user_id`, `category_id`, `product_id`),
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  INDEX `Category_List_ibfk_4_idx` (`requirement_id` ASC) VISIBLE,
  CONSTRAINT `Product_List_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kd5f`.`Account` (`user_id`),
  CONSTRAINT `Product_List_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `kd5f`.`Category` (`category_id`),
  CONSTRAINT `Product_List_ibfk_3`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`),
  CONSTRAINT `Product_List_ibfk_4`
    FOREIGN KEY (`requirement_id`)
    REFERENCES `kd5f`.`hardware_requirement` (`requirement_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Video`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Video` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Video` (
  `video-id` INT NOT NULL,
  `video-url` VARCHAR(255) NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`video-id`),
  INDEX `product_id_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_video_product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `kd5f`.`Wishlisted`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kd5f`.`Wishlisted` ;

CREATE TABLE IF NOT EXISTS `kd5f`.`Wishlisted` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `wishlisted_date` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `product_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `Wishlisted_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `kd5f`.`Account` (`user_id`),
  CONSTRAINT `Wishlisted_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `kd5f`.`Product` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
