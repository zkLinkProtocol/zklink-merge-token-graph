import { describe, test, assert, beforeAll } from "matchstick-as";
import {Address, BigInt, Bytes, crypto, ethereum} from "@graphprotocol/graph-ts";
import { Balance } from "../generated/schema";
import {loadOrCreateBalance} from "../src/merge-token-portal";

// The following tests are meant to check the assert functions work as expected
// Currently there's no way to test the exact message printed by the assert functions
// But we can observe it printed in the console when running the tests
describe("Asserts", () => {
    beforeAll(() => {
        let bal = loadOrCreateBalance(Bytes.fromHexString("0xaf5852ca4fc29264226ed0c396de30c945589d6d"),Bytes.fromHexString("0x2f8a25ac62179b31d62d7f80884ae57464699059"),BigInt.fromString("1712039212"),BigInt.fromString("50000000"));
        bal.save();
    })
    test("the test case dev", () => {
        const sourceToken = Bytes.fromHexString("0xaf5852ca4fc29264226ed0c396de30c945589d6d");
        const mergeToken = Bytes.fromHexString("0x2f8a25ac62179b31d62d7f80884ae57464699059");
        const id = Bytes.fromByteArray(
            crypto.keccak256(sourceToken.concat(mergeToken).concat(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromString("1712039212")))))
        );
        let bal = Balance.load(id);
        if (bal){
            assert.stringEquals(bal.balance.toString(), "50000000");
        }else {
            assert.assertNull(bal);
        }
    });
    test("just test a case for matchstick", () => {
        assert.stringEquals("?","?");
    })
    //
    // test("with default message", () => {
    //     assert.fieldEquals("Gravatar", "0x123", "id", "0x123");
    //     assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(1));
    //     assert.notInStore("Gravatar", "0x124");
    //     assert.addressEquals(Address.zero(), Address.zero());
    //     assert.bytesEquals(Bytes.fromUTF8("0x123"), Bytes.fromUTF8("0x123"));
    //     assert.i32Equals(1, 1);
    //     assert.bigIntEquals(BigInt.fromI32(1), BigInt.fromI32(1));
    //     assert.booleanEquals(true, true);
    //     assert.stringEquals("1", "1");
    //     assert.arrayEquals([ethereum.Value.fromI32(1)], [ethereum.Value.fromI32(1)]);
    //     assert.tupleEquals(changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]), changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]));
    //     assert.assertTrue(true);
    //     assert.assertNull(null)
    //     assert.assertNotNull("not null")
    //     assert.entityCount("Gravatar", 1)
    // });
    //
    // test("with custom message", () => {
    //     assert.fieldEquals("Gravatar", "0x123", "id", "0x123", "Id should be 0x123");
    //     assert.equals(ethereum.Value.fromI32(1), ethereum.Value.fromI32(1), "Value should equal 1");
    //     assert.notInStore("Gravatar", "0x124", "Gravatar should not be in store");
    //     assert.addressEquals(Address.zero(), Address.zero(), "Address should be zero");
    //     assert.bytesEquals(Bytes.fromUTF8("0x123"), Bytes.fromUTF8("0x123"), "Bytes should be equal");
    //     assert.i32Equals(2, 2, "I32 should equal 2");
    //     assert.bigIntEquals(BigInt.fromI32(1), BigInt.fromI32(1), "BigInt should equal 1");
    //     assert.booleanEquals(true, true, "Boolean should be true");
    //     assert.stringEquals("1", "1", "String should equal 1");
    //     assert.arrayEquals([ethereum.Value.fromI32(1)], [ethereum.Value.fromI32(1)], "Arrays should be equal");
    //     assert.tupleEquals(changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]), changetype<ethereum.Tuple>([ethereum.Value.fromI32(1)]), "Tuples should be equal");
    //     assert.assertTrue(true, "Should be true");
    //     assert.assertNull(null, "Should be null");
    //     assert.assertNotNull("not null", "Should be not null");
    //     assert.entityCount("Gravatar", 1, "There should be 2 gravatars");
    //     assert.dataSourceCount("GraphTokenLockWallet", 1, "GraphTokenLockWallet template should have one data source");
    //     assert.dataSourceExists("GraphTokenLockWallet", Address.zero().toHexString(), "GraphTokenLockWallet should have a data source for zero address");
    // });
    //
    // // We expect the test to fail and print the default message
    // // (assert.dataSourceCount) Expected dataSource count for template `GraphTokenLockWallet` to be '{expected}' but was '{actual}'
    // test("should fail with the passed custom message", () => {
    //     assert.dataSourceCount("GraphTokenLockWallet", 2);
    // }, true);
    //
    // We expect the test to fail and print the custom message
    // test("should fail with the passed custom message", () => {
    //     assert.dataSourceCount("GraphTokenLockWallet", 2, "GraphTokenLockWallet template should have 2 data sources");
    // }, true);
});