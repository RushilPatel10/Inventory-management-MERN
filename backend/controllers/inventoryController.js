const Inventory = require('../models/Inventory');
const csv = require('fast-csv');
const fs = require('fs');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    const populatedItem = await savedItem.populate('supplier');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('supplier');
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.importCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const items = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on('data', (row) => {
        items.push({
          name: row.name,
          quantity: parseInt(row.quantity),
          category: row.category,
          lowStockThreshold: parseInt(row.lowStockThreshold),
          supplier: row.supplier
        });
      })
      .on('end', async () => {
        try {
          await Inventory.insertMany(items);
          fs.unlinkSync(req.file.path);
          res.json({ message: 'CSV imported successfully' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const items = await Inventory.find().populate('supplier');
    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream('export.csv');

    csvStream.pipe(writableStream);
    items.forEach((item) => {
      csvStream.write({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        supplier: item.supplier?.name || '',
        lowStockThreshold: item.lowStockThreshold
      });
    });
    csvStream.end();

    writableStream.on('finish', () => {
      res.download('export.csv', 'inventory.csv', (err) => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        fs.unlinkSync('export.csv');
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 