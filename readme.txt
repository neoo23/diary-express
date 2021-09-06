# ============
# INSTALLATION
# ============

#1 clone code from repo
git clone https://github.com/neoo23/diary-express.git

#2 install npm
#3 init npm
npm init

#4 install needed software
npm i express
npm i express-processimage
npm i xml2js


# =========
# Configure
# =========

maybe change xml and image directories in config.js
maybe change tags in index.js

# =====
# Start
# =====

npm start
open browser: http://localhost:3000



# =======================
# Images Folder Structure
# =======================
format: <yyyy>/<yyyymm>/<yyyymmdd> <name>
example: <config.js imageFolder>\2021\202101\20210100\
the date metadata for each image is taken from the image name to integrate into the diary days/paragraphs (pa)

# =================
# Diary Data in XML
# ==================
see data type definition: ./data/diary/diary-month.dtd
see example: ./data/diary/2021-01.xml
its recommended to define and use your own tags, see/change index.js: tag