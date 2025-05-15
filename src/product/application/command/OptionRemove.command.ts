export default class OptionRemoveCommand {
  constructor(
    public readonly product_id: number,
    public readonly option_id: number,
  ) {}
}
